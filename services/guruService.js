const prisma = require("../config/db");

// ==============================
// AMBIL SEMUA GURU
// ==============================
exports.getAllGuru = async () => {
  return await prisma.guruInfo.findMany({
    orderBy: { id: "desc" },
  });
};

// ==============================
// TAMBAH GURU BARU
// ==============================
exports.addGuru = async (data) => {
  return await prisma.guruInfo.create({
    data: {
      nama_guru: data.nama_guru,
      mata_pelajaran: data.mata_pelajaran,
      deskripsi: data.deskripsi,
      link_sosial_media: data.link_sosial_media,
      foto_guru: data.foto_guru,
    },
  });
};

// ==============================
// UPDATE GURU
// ==============================
exports.updateGuru = async (id, data) => {
  const guru = await prisma.guruInfo.findUnique({
    where: { id: Number(id) },
  });
  if (!guru) throw new Error("Guru tidak ditemukan");

  return await prisma.guruInfo.update({
    where: { id: Number(id) },
    data: {
      nama_guru: data.nama_guru,
      mata_pelajaran: data.mata_pelajaran,
      deskripsi: data.deskripsi,
      link_sosial_media: data.link_sosial_media,
      foto_guru: data.foto_guru || guru.foto_guru,
    },
  });
};

// ==============================
// AMBIL GURU BERDASARKAN ID
// ==============================
exports.getGuruById = async (id) => {
  return await prisma.guruInfo.findUnique({
    where: { id: Number(id) },
  });
};

// ==============================
// HAPUS GURU
// ==============================
exports.deleteGuru = async (id) => {
  const guru = await prisma.guruInfo.findUnique({
    where: { id: Number(id) },
  });
  if (!guru) throw new Error("Guru tidak ditemukan");

  await prisma.guruInfo.delete({
    where: { id: Number(id) },
  });

  return { success: true };
};
