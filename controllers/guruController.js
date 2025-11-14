const guruService = require("../services/guruService");
const cloudinary = require("../config/cloudinary");

// ✅ Ambil semua guru
exports.getAllGuru = async (req, res) => {
  try {
    const results = await guruService.getAllGuru();
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data guru", error: err.message });
  }
};

// ✅ Tambah guru baru
exports.addGuru = async (req, res) => {
  try {
    const { nama_guru, mata_pelajaran, deskripsi, link_sosial_media } = req.body;
    let foto_guru = null;

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads/guru",
      });
      foto_guru = upload.secure_url;
    }

    if (!nama_guru || !mata_pelajaran || !deskripsi) {
      return res.status(400).json({ message: "Data belum lengkap" });
    }

    const guruBaru = await guruService.addGuru({
      nama_guru,
      mata_pelajaran,
      deskripsi,
      link_sosial_media,
      foto_guru,
    });

    res.status(201).json({
      message: "Guru berhasil ditambahkan",
      data: guruBaru,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambah guru", error: err.message });
  }
};

// ✅ Update guru
exports.updateGuru = async (req, res) => {
  try {
    const { nama_guru, mata_pelajaran, deskripsi, link_sosial_media } = req.body;
    let foto_guru = req.body.foto_guru || null;

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads/guru",
      });
      foto_guru = upload.secure_url;
    }

    const updatedGuru = await guruService.updateGuru(req.params.id, {
      nama_guru,
      mata_pelajaran,
      deskripsi,
      link_sosial_media,
      foto_guru,
    });

    res.json({
      message: "Guru berhasil diperbarui",
      data: updatedGuru,
    });
  } catch (err) {
    if (err.message === "Guru tidak ditemukan") {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: "Gagal memperbarui guru", error: err.message });
  }
};

// ✅ Ambil guru by ID
exports.getGuruById = async (req, res) => {
  try {
    const guru = await guruService.getGuruById(req.params.id);
    if (!guru) return res.status(404).json({ message: "Guru tidak ditemukan" });
    res.json(guru);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data guru", error: err.message });
  }
};

// ✅ Hapus guru
exports.deleteGuru = async (req, res) => {
  try {
    const result = await guruService.deleteGuru(req.params.id);
    res.json({ message: "Guru berhasil dihapus", result });
  } catch (err) {
    if (err.message === "Guru tidak ditemukan") {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: "Gagal menghapus data guru", error: err.message });
  }
};
