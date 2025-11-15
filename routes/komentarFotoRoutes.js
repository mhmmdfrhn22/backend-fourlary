const express = require('express');
const router = express.Router();
const komentarFotoController = require('../controllers/komentarFotoController');

router.get("/", komentarFotoController.getAllKomentar);

router.get("/byuploader", komentarFotoController.getKomentarByUploader);
router.get("/count/:user_id", komentarFotoController.getKomentarCountByUser);

// dynamic (last)
router.get('/:id_foto', komentarFotoController.getKomentarByFoto);

router.post('/', komentarFotoController.createKomentar);

router.put("/:id", komentarFotoController.updateKomentar);

router.delete('/:id', komentarFotoController.deleteKomentar);

module.exports = router;
