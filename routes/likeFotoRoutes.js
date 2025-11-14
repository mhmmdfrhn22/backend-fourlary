const express = require('express');
const router = express.Router();
const likeCtrl = require('../controllers/likeFotoController');

// ✅ Pindahkan ini ke atas supaya tidak bentrok
router.get("/count/:user_id", likeCtrl.getLikeCountByUser);
router.get("/stats/:userId", likeCtrl.getLikeStats);

// 🔽 Baru sisanya di bawah
router.get('/:id_foto', likeCtrl.getLikeCount);
router.get('/:id_foto/:id_user', likeCtrl.checkUserLike);
router.post('/', likeCtrl.addLike);
router.delete('/', likeCtrl.removeLike);


module.exports = router;