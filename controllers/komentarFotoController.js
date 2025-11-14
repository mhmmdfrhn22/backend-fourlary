// controllers/komentarController.js
const komentarService = require("../services/komentarFotoService");

// ✅ GET semua komentar (opsional filter berdasarkan uploader foto)
exports.getAllKomentar = async (req, res) => {
  try {
    const { uploader_id } = req.query;
    const result = await komentarService.getAllKomentar(uploader_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Hitung jumlah komentar yang diterima user
exports.getKomentarCountByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) return res.status(400).json({ message: "user_id wajib diisi" });

    const result = await komentarService.getKomentarCountByUser(user_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Komentar untuk semua foto milik user (khusus uploader)
exports.getKomentarByUploader = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id)
      return res.status(400).json({ message: "Parameter user_id wajib diisi" });

    const result = await komentarService.getKomentarByUploader(user_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Komentar berdasarkan foto
exports.getKomentarByFoto = async (req, res) => {
  try {
    const { id_foto } = req.params;
    const result = await komentarService.getKomentarByFoto(id_foto);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Tambah komentar
exports.createKomentar = async (req, res) => {
  try {
    const { id_foto, id_user, isi_komentar } = req.body;
    if (!id_foto || !id_user || !isi_komentar) {
      return res.status(400).json({ message: "Semua data harus diisi" });
    }

    const newKomentar = await komentarService.createKomentar(id_foto, id_user, isi_komentar);
    res.status(201).json({
      message: "Komentar berhasil ditambahkan",
      data: newKomentar,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Hapus komentar
exports.deleteKomentar = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await komentarService.deleteKomentar(id);
    res.json({ message: "Komentar berhasil dihapus", result });
  } catch (err) {
    if (err.message === "Komentar tidak ditemukan") {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: err.message });
  }
};
