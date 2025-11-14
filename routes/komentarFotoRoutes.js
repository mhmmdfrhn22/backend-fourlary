const express = require('express');
const router = express.Router();
const komentarFotoController = require('../controllers/komentarFotoController');


// GET semua komentar
router.get("/", komentarFotoController.getAllKomentar);

// GET komentar berdasarkan foto
router.get('/:id_foto', komentarFotoController.getKomentarByFoto);

// POST komentar baru
router.post('/', komentarFotoController.createKomentar);

// DELETE komentar berdasarkan id
router.delete('/:id', komentarFotoController.deleteKomentar);

router.get("/byuploader", komentarFotoController.getKomentarByUploader); // 🔹 Ambil komentar berdasarkan uploader foto

router.get("/count/:user_id", komentarFotoController.getKomentarCountByUser);

module.exports = router;
