const fotoService = require("../services/fotoService");
const prisma = require("../config/db");

// ✅ Ambil semua foto
exports.getAllFoto = async (req, res) => {
  try {
    const uploader_id = req.query.uploader_id;
    const result = await fotoService.getAllFoto(uploader_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Ambil foto milik user
exports.getFotoByUploader = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id)
      return res.status(400).json({ message: "Parameter user_id wajib diisi" });

    const result = await fotoService.getFotoByUploader(user_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Hitung jumlah foto user
exports.getFotoCountByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id)
      return res.status(400).json({ message: "user_id wajib diisi" });

    const count = await fotoService.getFotoCountByUser(user_id);
    res.json({ total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Ambil foto by ID
exports.getFotoById = async (req, res) => {
  try {
    const foto = await fotoService.getFotoById(req.params.id);
    if (!foto) return res.status(404).json({ message: "Foto tidak ditemukan" });
    res.json(foto);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Tambah foto (upload ke Cloudinary)
exports.createFoto = async (req, res) => {
  try {
    const { id_kategori, deskripsi, diupload_oleh } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File foto diperlukan" });
    }

    const fotoUrl = req.file.path; // URL dari Cloudinary (multer-storage-cloudinary)

    const newFoto = await prisma.fotoGaleri.create({
      data: {
        id_kategori: parseInt(id_kategori),
        url_foto: fotoUrl,
        deskripsi,
        diupload_oleh: diupload_oleh ? parseInt(diupload_oleh) : null,
      },
      include: {
        kategori: true,
        uploader: true,
      },
    });

    res.status(201).json({
      message: "✅ Foto berhasil diunggah ke Cloudinary & disimpan ke database",
      data: newFoto,
    });
  } catch (err) {
    console.error("❌ Error saat createFoto:", err);
    res.status(500).json({
      message: "Gagal menyimpan foto",
      error: err.message,
    });
  }
};

// ✅ Update foto (Cloudinary version)
exports.updateFoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_kategori, deskripsi } = req.body;
    const newFotoUrl = req.file ? req.file.path : null;

    // Ambil data lama dulu
    const existingFoto = await prisma.fotoGaleri.findUnique({
      where: { id_foto: parseInt(id) },
    });

    if (!existingFoto) {
      return res.status(404).json({ message: "Foto tidak ditemukan" });
    }

    // Update data
    const updatedFoto = await prisma.fotoGaleri.update({
      where: { id_foto: parseInt(id) },
      data: {
        id_kategori: id_kategori
          ? parseInt(id_kategori)
          : existingFoto.id_kategori,
        deskripsi: deskripsi ?? existingFoto.deskripsi,
        url_foto: newFotoUrl ?? existingFoto.url_foto,
      },
    });

    res.json({
      message: "✅ Foto berhasil diperbarui",
      data: updatedFoto,
    });
  } catch (err) {
    console.error("❌ Error saat updateFoto:", err);
    res.status(500).json({
      message: "Gagal memperbarui foto",
      error: err.message,
    });
  }
};

// ✅ Hapus foto
exports.deleteFoto = async (req, res) => {
  try {
    const result = await fotoService.deleteFoto(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Hitung total semua foto
exports.getFotoCount = async (req, res) => {
  try {
    const count = await fotoService.getFotoCount();
    res.json({ total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Generate PDF report
exports.generatePdfReport = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    await fotoService.generatePdfReport(limit, res);
  } catch (err) {
    res.status(500).json({
      message: "Gagal membuat laporan PDF",
      error: err.message,
    });
  }
};
