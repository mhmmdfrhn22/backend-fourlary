const komentarService = require("../services/komentarFotoService");

// ==============================
// GET semua komentar
// ==============================
exports.getAllKomentar = async (req, res) => {
  try {
    const { uploader_id } = req.query;
    const result = await komentarService.getAllKomentar(uploader_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// Hitung komentar diterima user
// ==============================
exports.getKomentarCountByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await komentarService.getKomentarCountByUser(user_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// Komentar untuk semua foto uploader
// ==============================
exports.getKomentarByUploader = async (req, res) => {
  try {
    const { user_id } = req.query;
    const result = await komentarService.getKomentarByUploader(user_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// Komentar berdasarkan foto (nested)
// ==============================
exports.getKomentarByFoto = async (req, res) => {
  try {
    const { id_foto } = req.params;
    const result = await komentarService.getKomentarByFoto(id_foto);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// Tambah komentar (support reply)
// ==============================
exports.createKomentar = async (req, res) => {
  try {
    const { id_foto, id_user, isi_komentar, parent_id } = req.body;

    const newKomentar = await komentarService.createKomentar(
      id_foto,
      id_user,
      isi_komentar,
      parent_id
    );

    res.status(201).json({
      message: "Komentar berhasil ditambahkan",
      data: newKomentar,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// Hapus komentar
// ==============================
exports.deleteKomentar = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await komentarService.deleteKomentar(id);
    res.json({ message: "Komentar berhasil dihapus", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
