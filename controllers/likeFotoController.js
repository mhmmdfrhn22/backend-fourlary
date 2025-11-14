// controllers/likeController.js
const likeService = require("../services/likeFotoService");

// ✅ Jumlah like per foto
exports.getLikeCount = async (req, res) => {
  try {
    const { id_foto } = req.params;
    const result = await likeService.getLikeCount(id_foto);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Total like dari semua foto milik user
exports.getLikeCountByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id)
      return res.status(400).json({ message: "user_id wajib diisi" });

    const result = await likeService.getLikeCountByUser(user_id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Statistik like berdasarkan waktu
exports.getLikeStats = async (req, res) => {
  try {
    const { userId } = req.params;
    let { range } = req.query;

    // default 7d
    if (!range) range = "7d";

    // langsung kirim string ke service
    const result = await likeService.getLikeStats(userId, range);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Cek apakah user sudah like foto
exports.checkUserLike = async (req, res) => {
  try {
    const { id_foto, id_user } = req.params;
    const liked = await likeService.checkUserLike(id_foto, id_user);
    res.json({ liked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Tambah like
exports.addLike = async (req, res) => {
  try {
    const { id_foto, id_user } = req.body;
    if (!id_foto || !id_user)
      return res.status(400).json({ message: "id_foto dan id_user wajib diisi" });

    const result = await likeService.addLike(id_foto, id_user);
    if (!result.success)
      return res.status(400).json({ message: result.message });

    res.status(201).json({ message: "Foto disukai", data: result.like });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Hapus like
exports.removeLike = async (req, res) => {
  try {
    const { id_foto, id_user } = req.body;
    if (!id_foto || !id_user)
      return res.status(400).json({ message: "id_foto dan id_user wajib diisi" });

    const result = await likeService.removeLike(id_foto, id_user);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Alias cek like (pakai query)
exports.checkLike = async (req, res) => {
  try {
    const { id_foto, id_user } = req.query;
    const liked = await likeService.checkLike(id_foto, id_user);
    res.json({ liked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
