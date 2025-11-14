const roleService = require('../services/roleService');

// ✅ GET semua role
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    if (!role) return res.status(404).json({ error: 'Role tidak ditemukan' });
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ CREATE role baru
exports.createRole = async (req, res) => {
  try {
    const { nama_role } = req.body;
    if (!nama_role)
      return res.status(400).json({ error: 'Nama role wajib diisi' });

    const result = await roleService.createRole(nama_role);
    res.status(201).json({
      id: result.insertId,
      nama_role,
      message: 'Role berhasil dibuat',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE role
exports.updateRole = async (req, res) => {
  try {
    const { nama_role } = req.body;
    if (!nama_role)
      return res.status(400).json({ error: 'Nama role wajib diisi' });

    const updated = await roleService.updateRole(req.params.id, nama_role);
    if (!updated.affectedRows)
      return res.status(404).json({ error: 'Role tidak ditemukan' });

    res.json({ message: 'Role berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE role
exports.deleteRole = async (req, res) => {
  try {
    const deleted = await roleService.deleteRole(req.params.id);
    if (!deleted.affectedRows)
      return res.status(404).json({ error: 'Role tidak ditemukan' });

    res.json({ message: 'Role berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
