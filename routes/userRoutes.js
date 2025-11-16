const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body, validationResult } = require('express-validator');
const verifyToken = require('../middleware/verifyToken');
const authMiddleware = require('../middleware/authMiddleware');
const verifyOtpMiddleware = require('../middleware/verifyOtpMiddleware');

// Statistik user
router.get("/stats", userController.getUserStats);

// Hitung tim publikasi
router.get('/publikasi/count', userController.getPublikasiTeamCount);

// Hitung user biasa
router.get('/count', userController.getUsersCount);

// User Login
router.post('/login',
  [
    body('email').isEmail().withMessage('Email harus valid'), // Validasi email
    body('password').isLength({ min: 6 }).withMessage('Minimal 6 karakter'), // Validasi password
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    userController.loginUser(req, res);
  }
);

// Register
router.post('/register',
  [
    body('username').isLength({ min: 4 }).withMessage('Minimal 4 karakter'),
    body('email').isEmail().withMessage('Email harus valid'),
    body('confirmEmail').isEmail().withMessage('Konfirmasi email harus valid'),
    body('password').isLength({ min: 6 }).withMessage('Minimal 6 karakter'),
    body('role_id').isInt().withMessage('role_id harus angka')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    userController.createUser(req, res);  // Menggunakan Brevo API untuk kirim OTP
  }
);

// Verifikasi email dengan OTP
router.post('/verify-email',
  [
    body('otp').isLength({ min: 6 }).withMessage('OTP harus terdiri dari 6 karakter'),
    body('userId').isInt().withMessage('userId harus angka')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    userController.verifyEmailOtp(req, res);  // Menggunakan Brevo untuk validasi OTP
  }
);

// Hapus penggunaan authMiddleware atau verifyToken untuk forgot-password dan reset-password
router.post('/forgot-password', 
  [
    body('email').isEmail().withMessage('Email harus valid'),
  ], 
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    userController.forgotPassword(req, res);  // Tidak perlu token di sini
  }
);

// Reset password dengan OTP tanpa memerlukan token (karena user belum login)
router.post('/reset-password',
  [
    body('otp').isLength({ min: 6 }).withMessage('OTP harus terdiri dari 6 karakter'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password baru minimal 6 karakter'),
    body('userId').isInt().withMessage('userId harus angka')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    userController.resetPassword(req, res);  // Tidak perlu token di sini
  }
);


// Get all users
router.get('/', verifyToken, userController.getAllUsers);

// Get current user
router.get('/me', authMiddleware, userController.getMe);

// Get user by ID
router.get('/:id', verifyToken, userController.getUserById);

// Update user
router.put('/:id', verifyToken, userController.updateUser);

// Delete user
router.delete('/:id', verifyToken, userController.deleteUser);

module.exports = router;
