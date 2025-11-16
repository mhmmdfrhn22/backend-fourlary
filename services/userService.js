const prisma = require('../config/db'); // pastikan ini import PrismaClient instance
const crypto = require('crypto');

// ✅ CREATE user
exports.createUser = async (username, email, hashedPassword, role_id) => {
  return await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role_id,
      isVerified: false, // email belum diverifikasi saat pendaftaran
    },
  });
};

// ✅ GET user by email
exports.getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// ✅ GET user by username
exports.getUserByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: { username },
  });
};

// ✅ GET semua user
exports.getAllUsers = async () => {
  return await prisma.user.findMany({
    include: { role: true },
    orderBy: { id: 'asc' },
  });
};

// ✅ GET user by id
exports.getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { role: true },
  });
};

// ✅ UPDATE user
exports.updateUser = async (id, username, hashedPassword, role_id) => {
  const dataToUpdate = {};

  if (username && username.trim() !== "") {
    dataToUpdate.username = username;
  }

  if (role_id) {
    dataToUpdate.role_id = Number(role_id);
  }

  if (hashedPassword && hashedPassword.trim() !== "") {
    dataToUpdate.password = hashedPassword;
  }

  return await prisma.user.update({
    where: { id: Number(id) },
    data: dataToUpdate,
  });
};

// ✅ DELETE user
exports.deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id: Number(id) },
  });
};

// ✅ COUNT semua user
exports.getUsersCount = async () => {
  return await prisma.user.count();
};

// ✅ COUNT tim publikasi (role_id = 3)
exports.getPublikasiTeamCount = async () => {
  return await prisma.user.count({
    where: { role_id: 3 },
  });
};

// ✅ Statistik user berdasarkan tanggal (range 7/14/30 hari)
// 🔧 Versi ORM — bebas error & lebih aman
exports.getUserStats = async (range = '7d') => {
  let interval = 7;
  if (range === '14d') interval = 14;
  else if (range === '30d') interval = 30;

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - interval);

  const users = await prisma.user.findMany({
    where: {
      created_at: {
        gte: sinceDate,
      },
    },
    select: {
      created_at: true,
    },
  });

  // 🔢 Kelompokkan manual per tanggal
  const stats = {};
  users.forEach((u) => {
    const date = u.created_at.toISOString().split('T')[0];
    stats[date] = (stats[date] || 0) + 1;
  });

  // ubah ke format array [{date, total}, ...]
  const result = Object.entries(stats)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return result;
};

// ✅ Simpan OTP untuk Verifikasi Email atau Reset Password
exports.saveOtpForUser = async (userId, otp, otpExpiry) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      otpCode: otp,
      otpExpires: otpExpiry,
    },
  });
};

// ✅ Verifikasi Email (Set status isVerified menjadi true)
exports.verifyEmail = async (userId) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      isVerified: true, // Update status verifikasi email
    },
  });
};

// ✅ Update Password user
exports.updatePassword = async (userId, hashedPassword) => {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
    },
  });
};
