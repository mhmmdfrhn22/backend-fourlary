const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const guruController = require('../controllers/guruController');

// Ambil semua guru
router.get('/', guruController.getAllGuru);

// Ambil 1 guru
router.get('/:id', guruController.getGuruById);

// Tambah guru (UPLOAD ke /uploads/guru otomatis)
router.post('/', upload.single('foto_guru'), guruController.addGuru);

// Update guru
router.patch('/:id', upload.single('foto_guru'), guruController.updateGuru);

// Hapus guru
router.delete('/:id', guruController.deleteGuru);

module.exports = router;