const express = require('express');
const router = express.Router();
const kategoriCtrl = require('../controllers/kategoriFotoController');

router.get('/', kategoriCtrl.getAllKategori);
router.get('/:id', kategoriCtrl.getKategoriById);
router.post('/', kategoriCtrl.createKategori);
router.put('/:id', kategoriCtrl.updateKategori);
router.delete('/:id', kategoriCtrl.deleteKategori);

module.exports = router;