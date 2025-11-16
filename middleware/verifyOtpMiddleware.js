const userService = require('../services/userService');

async function verifyOtpMiddleware(req, res, next) {
  try {
    const { otp, userId } = req.body;

    // Ambil data user berdasarkan userId
    const user = await userService.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan.' });

    // Cek apakah OTP yang dimasukkan sesuai dengan yang ada di database
    if (user.otpCode !== otp) {
      return res.status(400).json({ error: 'OTP tidak valid.' });
    }

    // Cek apakah OTP sudah kadaluarsa
    if (new Date() > user.otpExpires) {
      return res.status(400).json({ error: 'OTP telah kadaluarsa.' });
    }

    // Jika validasi sukses, lanjutkan ke request berikutnya
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = verifyOtpMiddleware;
