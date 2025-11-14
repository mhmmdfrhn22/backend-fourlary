const postService = require("../services/postsService");

// ✅ Ambil semua post
exports.getAllPosts = async (req, res) => {
  try {
    const { user_id } = req.query;
    const posts = await postService.getAllPosts(user_id);
    res.json(posts);
  } catch (err) {
    console.error("Error getAllPosts:", err);
    res.status(500).json({ message: "Gagal mengambil data post", error: err.message });
  }
};

// ✅ Ambil post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });
    res.json(post);
  } catch (err) {
    console.error("Error getPostById:", err);
    res.status(500).json({ message: "Gagal mengambil post", error: err.message });
  }
};

// ✅ Tambah post baru
exports.createPost = async (req, res) => {
  try {
    const { judul, kategori_id, isi, user_id, status } = req.body;
    const foto = req.file ? req.file.path : null; // 🟢 Langsung URL Cloudinary dari middleware

    if (!judul || !kategori_id || !isi || !user_id) {
      return res.status(400).json({ message: "Judul, kategori, isi, dan user wajib diisi" });
    }

    const newPost = await postService.createPost({
      judul,
      kategori_id,
      isi,
      user_id,
      status: status?.toLowerCase() || "draft",
      foto,
    });

    res.status(201).json({
      message: "Post berhasil ditambahkan",
      data: newPost,
    });
  } catch (err) {
    console.error("Error createPost:", err);
    res.status(500).json({ message: "Gagal menambah post", error: err.message });
  }
};

// ✅ Update post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, kategori_id, isi, user_id, status } = req.body;
    const foto = req.file ? req.file.path : null; // 🟢 URL Cloudinary

    const post = await postService.getPostById(id);
    if (!post) return res.status(404).json({ message: "Post tidak ditemukan" });

    const updatedPost = await postService.updatePost(id, {
      judul,
      kategori_id,
      isi,
      user_id,
      status: status?.toLowerCase() || post.status || "draft",
      foto: foto || post.foto,
    });

    res.json({
      message: "Post berhasil diperbarui",
      data: updatedPost,
    });
  } catch (err) {
    console.error("Error updatePost:", err);
    res.status(500).json({ message: "Gagal memperbarui post", error: err.message });
  }
};

// ✅ Hapus post
exports.deletePost = async (req, res) => {
  try {
    const result = await postService.deletePost(req.params.id);
    if (result?.notFound)
      return res.status(404).json({ message: "Post tidak ditemukan" });

    res.json({ message: "Post berhasil dihapus" });
  } catch (err) {
    console.error("Error deletePost:", err);
    res.status(500).json({ message: "Gagal menghapus post", error: err.message });
  }
};

// ✅ Hitung total post published
exports.getPostsCount = async (req, res) => {
  try {
    const count = await postService.getPostsCount();
    res.json({ total: count }); // 🔁 Ubah "count" jadi "total"
  } catch (err) {
    console.error("Error getPostsCount:", err);
    res.status(500).json({ message: "Gagal menghitung total post", error: err.message });
  }
};


// ✅ Hitung total post per user
exports.getPostCountByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const count = await postService.getPostCountByUser(user_id);
    res.json({ total: count });
  } catch (err) {
    console.error("Error getPostCountByUser:", err);
    res.status(500).json({ message: "Gagal menghitung total post user", error: err.message });
  }
};

// ✅ Ambil semua post milik user tertentu
exports.getPostsByUser = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ message: "user_id wajib diisi" });

    const posts = await postService.getPostsByUser(user_id);
    res.json(posts);
  } catch (err) {
    console.error("Error getPostsByUser:", err);
    res.status(500).json({ message: "Gagal mengambil post user", error: err.message });
  }
};
