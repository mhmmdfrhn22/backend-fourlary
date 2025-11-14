const jurusanService = require("../services/jurusanService");

// ✅ Ambil semua jurusan
exports.getAllJurusan = async (req, res) => {
  try {
    const result = await jurusanService.getAllJurusan();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil data jurusan", error: err.message });
  }
};

// ✅ Tambah jurusan baru
exports.createJurusan = async (req, res) => {
  try {
    const { nama_jurusan, deskripsi } = req.body;

    if (!nama_jurusan) {
      return res.status(400).json({ message: "Nama jurusan harus diisi" });
    }

    const jurusan = await jurusanService.createJurusan(nama_jurusan, deskripsi);
    res.status(201).json({
      message: "Jurusan berhasil ditambahkan",
      data: jurusan,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal menambah jurusan", error: err.message });
  }
};

// ✅ Update jurusan
exports.updateJurusan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_jurusan, deskripsi } = req.body;

    if (!nama_jurusan) {
      return res.status(400).json({ message: "Nama jurusan harus diisi" });
    }

    const updated = await jurusanService.updateJurusan(id, nama_jurusan, deskripsi);
    res.json({ message: "Jurusan berhasil diubah", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengubah jurusan", error: err.message });
  }
};

// ✅ Hapus jurusan
exports.deleteJurusan = async (req, res) => {
  try {
    const { id } = req.params;
    await jurusanService.deleteJurusan(id);
    res.json({ message: "Jurusan berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Gagal menghapus jurusan", error: err.message });
  }
};
