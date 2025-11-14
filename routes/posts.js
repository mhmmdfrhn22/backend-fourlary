const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const upload = require('../middleware/upload');

// ✅ Route spesifik dulu
router.get('/count', postsController.getPostsCount);
router.get('/count/:user_id', postsController.getPostCountByUser);
router.get('/user', postsController.getPostsByUser);

// ✅ Baru route umum di bawahnya
router.get('/', postsController.getAllPosts);
router.post('/', upload.single('foto'), postsController.createPost);
router.get('/:id', postsController.getPostById);
router.put('/:id', upload.single('foto'), postsController.updatePost);
router.delete('/:id', postsController.deletePost);

module.exports = router;
