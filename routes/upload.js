const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// Endpoint upload gambar
router.post('/', upload.single('foto'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Tidak ada file yang diupload' });
  }

  // Kirim balik URL file yang bisa diakses
  res.json({
    message: 'Upload berhasil',
    fileUrl: `/uploads/${req.file.filename}`
  });
});

module.exports = router;