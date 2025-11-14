const pembinatService = require("../services/pembinatService");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// ✅ GET semua pembinat
exports.getAllPembinat = async (req, res) => {
  try {
    const data = await pembinatService.getAllPembinat();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data pembinat", error: err.message });
  }
};

// ✅ CREATE pembinat (pakai Cloudinary)
exports.createPembinat = async (req, res) => {
  try {
    const { nama_pekerjaan, deskripsi, id_jurusan, id_pembimbing } = req.body;
    let gambar_pekerjaan = null;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads/pembinat",
      });
      gambar_pekerjaan = uploadResult.secure_url;

      // ✅ hapus file lokal hanya jika memang file lokal, bukan URL
      if (!req.file.path.startsWith("http")) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) {
          console.warn("⚠️ Gagal hapus file lokal:", e.message);
        }
      }
    }

    const id = await pembinatService.createPembinat({
      nama_pekerjaan,
      deskripsi,
      id_jurusan,
      id_pembimbing,
      gambar_pekerjaan,
    });

    res.status(201).json({ message: "✅ Pembinat berhasil ditambahkan", id });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambah pembinat", error: err.message });
  }
};

// ✅ UPDATE pembinat (pakai Cloudinary)
exports.updatePembinat = async (req, res) => {
  try {
    const { nama_pekerjaan, deskripsi, id_jurusan, id_pembimbing } = req.body;
    let gambarBaru = null;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "uploads/pembinat",
      });
      gambarBaru = uploadResult.secure_url;

      // ✅ hapus file lokal hanya jika memang file lokal, bukan URL
      if (!req.file.path.startsWith("http")) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (e) {
          console.warn("⚠️ Gagal hapus file lokal:", e.message);
        }
      }
    }

    const updated = await pembinatService.updatePembinat(req.params.id, {
      nama_pekerjaan,
      deskripsi,
      id_jurusan,
      id_pembimbing,
      gambarBaru,
    });

    if (!updated) return res.status(404).json({ message: "Data pembinat tidak ditemukan" });
    res.json({ message: "✅ Pembinat berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: "Gagal memperbarui pembinat", error: err.message });
  }
};

// ✅ DELETE pembinat
exports.deletePembinat = async (req, res) => {
  try {
    const deleted = await pembinatService.deletePembinat(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Data pembinat tidak ditemukan" });
    res.json({ message: "🗑️ Pembinat berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus pembinat", error: err.message });
  }
};
