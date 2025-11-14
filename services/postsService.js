const prisma = require("../config/db");
const { v2: cloudinary } = require("cloudinary");

// ✅ Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: "dprywyfwm",
  api_key: "API_KEY_LU",
  api_secret: "API_SECRET_LU",
});

// ==============================
// AMBIL SEMUA POST (opsional filter by user_id)
// ==============================
exports.getAllPosts = async (user_id) => {
  const where = user_id ? { user_id: Number(user_id) } : {};

  const posts = await prisma.post.findMany({
    where,
    include: {
      kategori: { select: { judul: true } },
      user: { select: { username: true } },
    },
    orderBy: { created_at: "desc" },
  });

  return posts.map((p) => ({
    id: p.id,
    judul: p.judul,
    isi: p.isi,
    kategori_id: p.kategori_id,
    user_id: p.user_id,
    status: p.status,
    created_at: p.created_at,
    updated_at: p.updated_at,
    kategori: p.kategori?.judul || "-",
    penulis: p.user?.username || "Admin",
    url_foto: p.foto || null, // 🟢 langsung URL Cloudinary
  }));
};

// ==============================
// AMBIL POST BY ID
// ==============================
exports.getPostById = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      kategori: { select: { judul: true } },
      user: { select: { username: true } },
    },
  });

  if (!post) return null;

  return {
    id: post.id,
    judul: post.judul,
    isi: post.isi,
    foto: post.foto,
    status: post.status,
    created_at: post.created_at,
    updated_at: post.updated_at,
    kategori: post.kategori?.judul || "-",
    penulis: post.user?.username || "-",
  };
};

// ==============================
// TAMBAH POST BARU
// ==============================
exports.createPost = async (data) => {
  const { judul, kategori_id, isi, user_id, status, foto } = data;

  // 🟢 Kalau upload lewat CloudinaryStorage, `foto` = URL langsung
  const fotoUrl = foto || null;

  const newPost = await prisma.post.create({
    data: {
      judul,
      kategori_id: kategori_id ? Number(kategori_id) : null,
      isi,
      user_id: user_id ? Number(user_id) : null,
      status: status || "draft",
      foto: fotoUrl, // 🟢 Simpan Cloudinary URL
    },
  });

  return newPost;
};

// ==============================
// UPDATE POST
// ==============================
exports.updatePost = async (id, data) => {
  const { judul, kategori_id, isi, user_id, status, foto } = data;

  const existing = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!existing) throw new Error("Post tidak ditemukan");

  // 🟢 Kalau ada foto baru dari Cloudinary, langsung ganti
  const fotoUrl = foto || existing.foto;

  const updated = await prisma.post.update({
    where: { id: Number(id) },
    data: {
      judul: judul ?? existing.judul,
      kategori_id: kategori_id ? Number(kategori_id) : existing.kategori_id,
      isi: isi ?? existing.isi,
      user_id: user_id ? Number(user_id) : existing.user_id,
      status: status ?? existing.status,
      foto: fotoUrl,
    },
  });

  return updated;
};

// ==============================
// HAPUS POST
// ==============================
exports.deletePost = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) return { notFound: true };

  // 🟢 Hapus dari Cloudinary kalau ada URL
  if (post.foto && post.foto.includes("cloudinary.com")) {
    const publicId = post.foto
      .split("/")
      .slice(-2)
      .join("/")
      .replace(/\.[^/.]+$/, "");
    await cloudinary.uploader.destroy(publicId);
  }

  await prisma.post.delete({
    where: { id: Number(id) },
  });

  return { success: true };
};

// ==============================
// HITUNG JUMLAH POST PUBLISHED
// ==============================
exports.getPostsCount = async () => {
  const count = await prisma.post.count({
    where: { status: "published" },
  });
  return count;
};

// ==============================
// HITUNG JUMLAH POST OLEH USER
// ==============================
exports.getPostCountByUser = async (user_id) => {
  const count = await prisma.post.count({
    where: { user_id: Number(user_id) },
  });
  return count;
};

// ==============================
// AMBIL POST OLEH USER
// ==============================
exports.getPostsByUser = async (user_id) => {
  const posts = await prisma.post.findMany({
    where: { user_id: Number(user_id) },
    orderBy: { id: "desc" },
  });
  return posts;
};
