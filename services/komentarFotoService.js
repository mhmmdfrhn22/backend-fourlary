const prisma = require("../config/db");

// ==============================
// Ambil semua komentar (opsional filter berdasarkan uploader)
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
      replies: true
    },
    orderBy: { tanggal_komentar: "desc" },
  });

  return komentarList.map((k) => ({
    id_komentar: k.id_komentar,
    id_foto: k.id_foto,
    id_user: k.id_user,
    isi_komentar: k.isi_komentar,
    tanggal_komentar: k.tanggal_komentar,
    parent_id: k.parent_id,
    username: k.user?.username || "-",
    url_foto: k.foto?.url_foto || null,
    nama_foto: k.foto?.deskripsi || "-",
    replies: k.replies
  }));
};

// ==============================
// Hitung total komentar dari semua foto uploader
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
      replies: true,
    },
    orderBy: { tanggal_komentar: "desc" },
  });

  return komentarList.map((k) => ({
    id_komentar: k.id_komentar,
    id_foto: k.id_foto,
    id_user: k.id_user,
    isi_komentar: k.isi_komentar,
    tanggal_komentar: k.tanggal_komentar,
    parent_id: k.parent_id,
    username: k.user?.username || "-",
    url_foto: k.foto?.url_foto || null,
    nama_foto: k.foto?.deskripsi || "-",
    replies: k.replies
  }));
};

// ==============================
// Ambil komentar berdasarkan foto (beserta reply)
// ==============================
exports.getKomentarByFoto = async (id_foto) => {
  const komentarUtama = await prisma.komentarFoto.findMany({
    where: { 
      id_foto: Number(id_foto), 
      parent_id: null 
    },
    include: {
      user: { select: { username: true } },

      // WAJIB: gunakan nama relation sesuai schema
      replies: {
        include: {
          user: { select: { username: true } },
          // kalau ingin nested deep:
          replies: {
            include: {
              user: { select: { username: true } }
            }
          }
        },
        orderBy: { tanggal_komentar: "asc" },
      },
    },
    orderBy: { tanggal_komentar: "desc" },
  });

  return komentarUtama.map((k) => ({
    id_komentar: k.id_komentar,
    id_foto: k.id_foto,
    id_user: k.id_user,
    isi_komentar: k.isi_komentar,
    tanggal_komentar: k.tanggal_komentar,
    parent_id: k.parent_id,
    username: k.user?.username || "-",
    replies: k.replies.map((r) => ({
      id_komentar: r.id_komentar,
      id_foto: r.id_foto,
      id_user: r.id_user,
      isi_komentar: r.isi_komentar,
      tanggal_komentar: r.tanggal_komentar,
      parent_id: r.parent_id,
      username: r.user?.username || "-",

      // nested reply level 2
      replies: r.replies?.map((rr) => ({
        id_komentar: rr.id_komentar,
        isi_komentar: rr.isi_komentar,
        tanggal_komentar: rr.tanggal_komentar,
        parent_id: rr.parent_id,
        username: rr.user?.username || "-",
      })) || [],
    })),
  }));
};


// ==============================
// Tambah komentar baru (mendukung reply)
// ==============================
exports.createKomentar = async (id_foto, id_user, isi_komentar, parent_id) => {
  return await prisma.komentarFoto.create({
    data: {
      id_foto: Number(id_foto),
      id_user: Number(id_user),
      isi_komentar,
      parent_id:
        parent_id !== undefined && parent_id !== null
          ? Number(parent_id)
          : null,
    },
  });
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

// ==============================
// Edit komentar
// ==============================
exports.updateKomentar = async (id, isi_komentar) => {
  // Periksa apakah komentar ada
  const komentar = await prisma.komentarFoto.findUnique({
    where: { id_komentar: Number(id) },
  });

  if (!komentar) throw new Error("Komentar tidak ditemukan");

  // Update komentar
  const updatedKomentar = await prisma.komentarFoto.update({
    where: { id_komentar: Number(id) },
    data: {
      isi_komentar, // Update isi komentar
    },
  });

  return updatedKomentar;
};
