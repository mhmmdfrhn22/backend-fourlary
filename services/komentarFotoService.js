const prisma = require("../config/db");

// ==============================
// Ambil semua komentar (opsional filter berdasarkan uploader foto)
// ==============================
exports.getAllKomentar = async (uploader_id) => {
  const where = uploader_id
    ? { foto: { diupload_oleh: Number(uploader_id) } }
    : {};

  const komentarList = await prisma.komentarFoto.findMany({
    where,
    include: {
      user: { select: { username: true } },
      foto: { select: { url_foto: true, deskripsi: true } },
    },
    orderBy: { tanggal_komentar: "desc" },
  });

  return komentarList.map((k) => ({
    id_komentar: k.id_komentar,
    id_foto: k.id_foto,
    id_user: k.id_user,
    isi_komentar: k.isi_komentar,
    tanggal_komentar: k.tanggal_komentar,
    username: k.user?.username || "-",
    url_foto: k.foto?.url_foto || null,
    nama_foto: k.foto?.deskripsi || "-",
  }));
};

// ==============================
// Hitung total komentar dari semua foto yang diupload user
// ==============================
exports.getKomentarCountByUser = async (user_id) => {
  const count = await prisma.komentarFoto.count({
    where: { foto: { diupload_oleh: Number(user_id) } },
  });
  return { total: count };
};

// ==============================
// Ambil semua komentar untuk foto yang diupload user tertentu
// ==============================
exports.getKomentarByUploader = async (user_id) => {
  const komentarList = await prisma.komentarFoto.findMany({
    where: { foto: { diupload_oleh: Number(user_id) } },
    include: {
      user: { select: { username: true } },
      foto: { select: { url_foto: true, deskripsi: true } },
    },
    orderBy: { tanggal_komentar: "desc" },
  });

  return komentarList.map((k) => ({
    id_komentar: k.id_komentar,
    id_foto: k.id_foto,
    id_user: k.id_user,
    isi_komentar: k.isi_komentar,
    tanggal_komentar: k.tanggal_komentar,
    username: k.user?.username || "-",
    url_foto: k.foto?.url_foto || null,
    nama_foto: k.foto?.deskripsi || "-",
  }));
};

// ==============================
// Ambil semua komentar berdasarkan foto
// ==============================
exports.getKomentarByFoto = async (id_foto) => {
  const komentarList = await prisma.komentarFoto.findMany({
    where: { id_foto: Number(id_foto) },
    include: {
      user: { select: { username: true } },
    },
    orderBy: { tanggal_komentar: "desc" },
  });

  return komentarList.map((k) => ({
    id_komentar: k.id_komentar,
    id_user: k.id_user,
    isi_komentar: k.isi_komentar,
    tanggal_komentar: k.tanggal_komentar,
    username: k.user?.username || "-",
  }));
};

// ==============================
// Tambah komentar baru
// ==============================
exports.createKomentar = async (id_foto, id_user, isi_komentar) => {
  const newKomentar = await prisma.komentarFoto.create({
    data: {
      id_foto: Number(id_foto),
      id_user: Number(id_user),
      isi_komentar,
    },
  });
  return newKomentar;
};

// ==============================
// Hapus komentar
// ==============================
exports.deleteKomentar = async (id) => {
  const existing = await prisma.komentarFoto.findUnique({
    where: { id_komentar: Number(id) },
  });

  if (!existing) throw new Error("Komentar tidak ditemukan");

  await prisma.komentarFoto.delete({
    where: { id_komentar: Number(id) },
  });

  return { success: true };
};