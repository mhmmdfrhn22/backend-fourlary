const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtSecret = process.env.JWT_SECRET || 'rahasia';

// ✅ Register user baru
exports.createUser = async (req, res) => {
  try {
    const { username, password, role_id } = req.body;
    if (!username || !password || !role_id)
      return res.status(400).json({ error: 'Semua field wajib diisi' });

    const hashedPassword = bcrypt.hashSync(password, 8);
    const result = await userService.createUser(username, hashedPassword, role_id);

    res.status(201).json({ id: result.insertId, username, role_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login user
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userService.getUserByUsername(username);

    if (!user) return res.status(401).json({ error: 'User tidak ditemukan.' });
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
