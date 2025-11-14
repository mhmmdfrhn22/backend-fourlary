const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { body, validationResult } = require('express-validator');
const verifyToken = require('../middleware/verifyToken');
const authMiddleware = require('../middleware/authMiddleware');

router.get("/stats", userController.getUserStats);

// Count tim publikasi
router.get('/publikasi/count', userController.getPublikasiTeamCount);


// Count user biasa
router.get('/count', userController.getUsersCount);

// User Login
router.post('/login',
  [
    body('username').isLength({ min: 4 }).withMessage('Minimal 4 karakter'),
    body('password').isLength({ min: 6 }).withMessage('Minimal 6 karakter'),
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
    body('password').isLength({ min: 6 }).withMessage('Minimal 6 karakter'),
    body('role_id').isInt().withMessage('role_id harus angka')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    userController.createUser(req, res);
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