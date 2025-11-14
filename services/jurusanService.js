const prisma = require("../config/db");

// ==============================
// AMBIL SEMUA JURUSAN
// ==============================
exports.getAllJurusan = async () => {
  const jurusanList = await prisma.jurusanSekolah.findMany({
    include: {
      _count: { select: { pekerjaan: true } }, // ✅ hanya relasi ini yang ada di schema
    },
    orderBy: { created_at: "desc" },
  });

  return jurusanList.map((j) => ({
    id_jurusan: j.id_jurusan,
    nama_jurusan: j.nama_jurusan,
    deskripsi: j.deskripsi,
    created_at: j.created_at,
    updated_at: j.updated_at,
    total_pekerjaan: j._count.pekerjaan, // ✅ ganti ini juga biar sesuai
  }));
};

// ==============================
// TAMBAH JURUSAN BARU
// ==============================
exports.createJurusan = async (nama_jurusan, deskripsi = null) => {
  const jurusanBaru = await prisma.jurusanSekolah.create({
    data: { nama_jurusan, deskripsi },
  });
  return jurusanBaru;
};

// ==============================
// UPDATE JURUSAN
// ==============================
exports.updateJurusan = async (id, nama_jurusan, deskripsi = null) => {
  const existing = await prisma.jurusanSekolah.findUnique({
    where: { id_jurusan: Number(id) },
  });
  if (!existing) throw new Error("Jurusan tidak ditemukan");

  const updated = await prisma.jurusanSekolah.update({
    where: { id_jurusan: Number(id) },
    data: { nama_jurusan, deskripsi },
  });
  return updated;
};

// ==============================
// HAPUS JURUSAN
// ==============================
exports.deleteJurusan = async (id) => {
  const existing = await prisma.jurusanSekolah.findUnique({
    where: { id_jurusan: Number(id) },
  });
  if (!existing) throw new Error("Jurusan tidak ditemukan");

  await prisma.jurusanSekolah.delete({
    where: { id_jurusan: Number(id) },
  });

  return { success: true };
};
