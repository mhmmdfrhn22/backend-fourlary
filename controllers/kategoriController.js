const kategoriService = require("../services/kategoriService");

// ✅ Ambil semua kategori
exports.getAllKategori = async (req, res) => {
  try {
    const kategori = await kategoriService.getAllKategori();
    res.json(kategori);
  } catch (err) {
    console.error("Error getAllKategori:", err);
    res.status(500).json({
      message: "Gagal mengambil data kategori",
      error: err.message,
    });
  }
};

// ✅ Tambah kategori baru
exports.createKategori = async (req, res) => {
  try {
    const { judul } = req.body;

    if (!judul) {
      return res.status(400).json({
        message: "Judul kategori harus diisi",
      });
    }

    const kategoriBaru = await kategoriService.createKategori(judul);

    res.status(201).json({
      message: "Kategori berhasil ditambahkan",
      data: kategoriBaru,
    });
  } catch (err) {
    console.error("Error createKategori:", err);
    res.status(500).json({
      message: "Gagal menambah kategori",
      error: err.message,
    });
  }
};

// ✅ Ambil kategori berdasarkan ID
exports.getKategoriById = async (req, res) => {
  try {
    const { id } = req.params;
    const kategori = await kategoriService.getKategoriById(id);

    if (!kategori) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    res.json(kategori);
  } catch (err) {
    console.error("Error getKategoriById:", err);
    res.status(500).json({
      message: "Gagal mengambil kategori",
      error: err.message,
    });
  }
};

// ✅ Update kategori
exports.updateKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul } = req.body;

    if (!judul) {
      return res.status(400).json({
        message: "Judul kategori harus diisi",
      });
    }

    const kategori = await kategoriService.getKategoriById(id);
    if (!kategori) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    const updated = await kategoriService.updateKategori(id, judul);

    res.json({
      message: "Kategori berhasil diperbarui",
      data: updated,
    });
  } catch (err) {
    console.error("Error updateKategori:", err);
    res.status(500).json({
      message: "Gagal memperbarui kategori",
      error: err.message,
    });
  }
};

// ✅ Hapus kategori
exports.deleteKategori = async (req, res) => {
  try {
    const { id } = req.params;

    const kategori = await kategoriService.getKategoriById(id);
    if (!kategori) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    await kategoriService.deleteKategori(id);

    res.json({
      message: "Kategori berhasil dihapus",
    });
  } catch (err) {
    console.error("Error deleteKategori:", err);
    res.status(500).json({
      message: "Gagal menghapus kategori",
      error: err.message,
    });
  }
};
