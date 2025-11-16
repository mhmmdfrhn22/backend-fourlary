const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Scope untuk meminta akses informasi email dan profil pengguna Google
const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

// Mengonfigurasi Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/user/auth/google/callback",
    scope: ['profile', 'email'],  // Pastikan scope sesuai
    accessType: "offline", // Jika ingin mendapatkan refresh token
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Cek apakah user sudah ada di database berdasarkan google_id
      let user = await prisma.user.findUnique({
        where: { google_id: profile.id }
      });

      if (!user) {
        // Jika user tidak ditemukan, buat user baru
        user = await prisma.user.create({
          data: {
            google_id: profile.id,
            username: profile.displayName, // Nama dari Google
            email: profile.emails[0].value, // Email dari Google
            photo_url: profile.photos[0].value, // Foto profil dari Google
            role_id: 1, // Default role
          },
        });
      }

      return done(null, user); // Kirim user ke session
    } catch (error) {
      console.error(error);
      return done(error, null);
    }
  }
));

// Menyimpan ID user ke session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Mengambil user berdasarkan ID dari session
passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

module.exports = passport;
