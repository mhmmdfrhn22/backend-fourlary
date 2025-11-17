const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtSecret = process.env.JWT_SECRET || 'rahasia';
const crypto = require('crypto');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY); // Pastikan API key sudah benar
const { sendResetPasswordEmail } = require('../services/emailService');

// ✅ Register user baru
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, confirmEmail, role_id } = req.body;

    if (!username || !email || !password || !confirmEmail || !role_id)
      return res.status(400).json({ error: 'Semua field wajib diisi' });

    // Validasi apakah email dan konfirmasi email sama
    if (email !== confirmEmail)
      return res.status(400).json({ error: 'Email dan konfirmasi email tidak cocok' });

    // Cek apakah email sudah terdaftar
    const existingUser = await userService.getUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: 'Email sudah terdaftar.' });

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Simpan user terlebih dahulu dengan status email belum diverifikasi
    const result = await userService.createUser(username, email, hashedPassword, role_id);

    // Generate OTP untuk verifikasi email
    const otp = crypto.randomBytes(3).toString('hex').toUpperCase(); // Generate OTP 6 karakter
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15); // OTP berlaku 15 menit

    // Simpan OTP dan waktu kedaluwarsa di database
    await userService.saveOtpForUser(result.id, otp, otpExpiry);

    // Kirim OTP ke email menggunakan Resend API
    sendOtpEmail(email, otp);

    res.status(201).json({ id: result.id, username, email, role_id, message: 'Verifikasi email telah dikirim, cek email Anda untuk verifikasi.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fungsi untuk mengirim OTP dan token JWT ke email
const sendOtpEmail = (email, otp) => {
  resend.emails.send({
    from: "Fourlary <noreply@farhanfym.my.id>",
    to: email,
    subject: 'Verifikasi Email - OTP',
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            h2 {
              color: #0046d1;
              text-align: center;
              font-size: 22px;
            }
            p {
              color: #333;
              font-size: 16px;
              line-height: 1.5;
            }
            .otp {
              font-size: 24px;
              font-weight: bold;
              color: #0046d1;
              background-color: #f2f7ff;
              padding: 12px;
              border-radius: 6px;
              text-align: center;
              display: inline-block;
              margin: 20px auto;
            }
            .footer {
              text-align: center;
              font-size: 14px;
              color: #999;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Verifikasi Email</h2>
            <p>Hi,</p>
            <p>Terima kasih telah mendaftar. Berikut adalah kode OTP untuk verifikasi email Anda:</p>
            <div class="otp">${otp}</div>
            <p>OTP ini berlaku selama 15 menit. Setelah itu, Anda perlu meminta kode baru.</p>
            <div class="footer">
              <p>Jika Anda tidak melakukan pendaftaran, abaikan email ini.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }).then(response => {
    console.log('OTP email sent: ', response);
  }).catch(error => {
    console.error('Error sending email: ', error);
  });
};


// ✅ Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);

    if (!user) return res.status(401).json({ error: 'User tidak ditemukan.' });
    if (!user.isVerified) return res.status(401).json({ error: 'Email belum terverifikasi.' });
    if (!bcrypt.compareSync(password, user.password))
      return res.status(401).json({ error: 'Password salah.' });

    const token = jwt.sign(
      { user_id: user.id, role_id: user.role_id },
      jwtSecret,
      { expiresIn: '1d' }
    );

    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Verify Email OTP
exports.verifyEmailOtp = async (req, res) => {
  try {
    const { otp, userId } = req.body;

    // Validasi OTP
    const user = await userService.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan.' });

    if (user.otpCode !== otp)
      return res.status(400).json({ error: 'OTP tidak valid.' });

    if (new Date() > user.otpExpires)
      return res.status(400).json({ error: 'OTP telah kadaluarsa.' });

    // Jika OTP valid, update status verifikasi
    await userService.verifyEmail(userId);

    res.json({ message: 'Email berhasil diverifikasi.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Forgot password - Send OTP dan JWT Token
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Cari user berdasarkan email
    const user = await userService.getUserByEmail(email);
    if (!user) return res.status(404).json({ error: 'Email tidak ditemukan.' });

    // Generate JWT untuk reset password
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '15m' });

    // Kirim token JWT untuk reset password ke email pengguna
    await sendResetPasswordEmail(email, token);

    res.json({ message: 'Email untuk reset password telah dikirim.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Reset Password tanpa OTP, hanya membutuhkan token dan password baru
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, token } = req.body;

    // Validasi konfirmasi password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Password dan konfirmasi password tidak cocok.' });
    }

    // Verifikasi token JWT untuk mendapatkan userId
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret); // Token JWT yang dikirimkan melalui email
    } catch (err) {
      return res.status(400).json({ error: 'Token tidak valid atau telah kedaluwarsa.' });
    }

    const userId = decoded.userId;

    // Cari user berdasarkan userId yang terdapat dalam token
    const user = await userService.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan.' });

    // Hash password baru
    const hashedPassword = bcrypt.hashSync(newPassword, 8);

    // Update password user
    await userService.updatePassword(userId, hashedPassword);

    res.json({ message: 'Password berhasil direset.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// ✅ Ambil semua user
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Ambil user berdasarkan ID
exports.getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update user
exports.updateUser = async (req, res) => {
  try {
    const { username, password, role_id } = req.body;
    const id = req.params.id;

    let hashedPassword;

    // hanya hash kalau password dikirim dan tidak kosong
    if (password && password.trim() !== "") {
      hashedPassword = bcrypt.hashSync(password, 8);
    }

    await userService.updateUser(id, username, hashedPassword, role_id);

    res.json({ message: 'User berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



// ✅ Delete user
exports.deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    if (!result.affectedRows)
      return res.status(404).json({ error: 'User tidak ditemukan.' });

    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Hitung total user
exports.getUsersCount = async (req, res) => {
  try {
    const total = await userService.getUsersCount();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Hitung total tim publikasi (role_id = 3)
exports.getPublikasiTeamCount = async (req, res) => {
  try {
    const total = await userService.getPublikasiTeamCount();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Statistik user by date
exports.getUserStats = async (req, res) => {
  try {
    const range = req.query.range || '7d';
    const stats = await userService.getUserStats(range);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get current user dari token
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const user = await userService.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
