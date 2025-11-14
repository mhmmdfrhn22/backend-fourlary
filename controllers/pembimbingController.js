const pembimbingService = require("../services/pembimbingService");
const cloudinary = require("../config/cloudinary"); // pastikan ada file config cloudinary.js
const fs = require("fs");
const path = require("path");

// ✅ Ambil semua pembimbing
exports.getAllPembimbing = async (req, res) => {
  try {
    const data = await pembimbingService.getAllPembimbing();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil data pembimbing",
      error: err.message,
    });
  }
};

// ✅ Ambil pembimbing berdasarkan ID
exports.getPembimbingById = async (req, res) => {
  try {
    const pembimbing = await pembimbingService.getPembimbingById(req.params.id);
    if (!pembimbing)
      return res.status(404).json({ message: "Pembimbing tidak ditemukan" });

    res.json(pembimbing);
  } catch (err) {
    res.status(500).json({
      message: "Gagal mengambil data pembimbing",
      error: err.message,
    });
  }
};

// ✅ Tambah pembimbing baru (PAKAI CLOUDINARY STORAGE LANGSUNG)
exports.createPembimbing = async (req, res) => {
  try {
    const { nama, nomor_wa, link_wa, jabatan, deskripsi } = req.body;
    let foto_pembimbing = null;

    // multer-storage-cloudinary sudah langsung kasih link
    if (req.file && req.file.path) {
      foto_pembimbing = req.file.path; // sudah secure_url dari Cloudinary
    }

    if (!nama || !jabatan) {
      return res.status(400).json({ message: "Nama dan jabatan wajib diisi!" });
    }

    const id = await pembimbingService.createPembimbing({
      nama,
      nomor_wa,
      link_wa,
      foto_pembimbing,
      jabatan,
      deskripsi,
    });

    res.status(201).json({
      message: "Pembimbing berhasil ditambahkan",
      id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Gagal menambah pembimbing",
      error: err.message,
    });
  }
};

// ✅ Update pembimbing (PAKAI CLOUDINARY STORAGE LANGSUNG)
exports.updatePembimbing = async (req, res) => {
  try {
    const { nama, nomor_wa, link_wa, jabatan, deskripsi } = req.body;
    let fotoBaru = null;

    if (req.file && req.file.path) {
      fotoBaru = req.file.path; // langsung URL Cloudinary
    }

    const updated = await pembimbingService.updatePembimbing(req.params.id, {
      nama,
      nomor_wa,
      link_wa,
      jabatan,
      deskripsi,
      fotoBaru,
    });

    if (!updated)
      return res.status(404).json({ message: "Pembimbing tidak ditemukan" });

    res.json({ message: "Pembimbing berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({
      message: "Gagal memperbarui pembimbing",
      error: err.message,
    });
  }
};


// ✅ Hapus pembimbing
exports.deletePembimbing = async (req, res) => {
  try {
    const deleted = await pembimbingService.deletePembimbing(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Pembimbing tidak ditemukan" });

    res.json({ message: "Pembimbing berhasil dihapus" });
  } catch (err) {
    res.status(500).json({
      message: "Gagal menghapus pembimbing",
      error: err.message,
    });
  }
};
