const kategoriFotoService = require("../services/kategoriFotoService");

// ✅ Ambil semua kategori
exports.getAllKategori = async (req, res) => {
  try {
    const results = await kategoriFotoService.getAllKategori();
    res.json(results);
  } catch (err) {
    console.error("❌ Gagal mengambil data kategori:", err);
    res.status(500).json({ message: "Gagal mengambil data kategori", error: err.message });
  }
};

// ✅ Ambil kategori berdasarkan ID
exports.getKategoriById = async (req, res) => {
  try {
    const { id } = req.params;
    const kategori = await kategoriFotoService.getKategoriById(id);

    if (!kategori) return res.status(404).json({ message: "Kategori tidak ditemukan" });

    res.json(kategori);
  } catch (err) {
    console.error("❌ Gagal mengambil kategori:", err);
    res.status(500).json({ message: "Gagal mengambil kategori", error: err.message });
  }
};

// ✅ Tambah kategori baru
exports.createKategori = async (req, res) => {
  try {
    const { nama_kategori, dibuat_oleh } = req.body;

    if (!nama_kategori) {
      return res.status(400).json({ message: "Nama kategori harus diisi" });
    }

    const dibuatOlehValue = dibuat_oleh || null;
    const result = await kategoriFotoService.createKategori(nama_kategori, dibuatOlehValue);

    res.status(201).json({
      message: "Kategori berhasil dibuat",
      id: result.id_kategori, // menyesuaikan field di Prisma
      nama_kategori,
      dibuat_oleh: dibuatOlehValue,
    });
  } catch (err) {
    console.error("❌ Gagal membuat kategori:", err);
    res.status(500).json({ message: "Gagal membuat kategori", error: err.message });
  }
};

// ✅ Update kategori
exports.updateKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_kategori } = req.body;

    if (!nama_kategori) {
      return res.status(400).json({ message: "Nama kategori harus diisi" });
    }

    await kategoriFotoService.updateKategori(id, nama_kategori);

    res.json({ message: "Kategori berhasil diperbarui" });
  } catch (err) {
    console.error("❌ Gagal memperbarui kategori:", err);
    res.status(500).json({ message: "Gagal memperbarui kategori", error: err.message });
  }
};

// ✅ Hapus kategori
exports.deleteKategori = async (req, res) => {
  try {
    const { id } = req.params;

    await kategoriFotoService.deleteKategori(id);

    res.json({ message: "Kategori berhasil dihapus" });
  } catch (err) {
    console.error("❌ Gagal menghapus kategori:", err);
    res.status(500).json({ message: "Gagal menghapus kategori", error: err.message });
  }
};
