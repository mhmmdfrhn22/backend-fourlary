const prisma = require("../config/db");

// ✅ Ambil semua kategori foto
exports.getAllKategori = async () => {
  const kategori = await prisma.kategoriFoto.findMany({
    orderBy: { tanggal_dibuat: "desc" },
    include: {
      dibuatOleh: { select: { username: true } }, // tampilkan siapa pembuatnya (optional)
      _count: { select: { fotoGaleri: true } }, // tampilkan jumlah foto per kategori
    },
  });
  return kategori.map((k) => ({
    id_kategori: k.id_kategori,
    nama_kategori: k.nama_kategori,
    tanggal_dibuat: k.tanggal_dibuat,
    dibuat_oleh: k.dibuatOleh?.username || "-",
    total_foto: k._count.fotoGaleri,
  }));
};

// ✅ Ambil kategori berdasarkan ID
exports.getKategoriById = async (id) => {
  const kategori = await prisma.kategoriFoto.findUnique({
    where: { id_kategori: Number(id) },
    include: {
      dibuatOleh: { select: { username: true } },
      fotoGaleri: true,
    },
  });
  if (!kategori) return null;
  return {
    ...kategori,
    dibuat_oleh: kategori.dibuatOleh?.username || "-",
  };
};

// ✅ Tambah kategori baru
exports.createKategori = async (nama_kategori, dibuat_oleh) => {
  const kategoriBaru = await prisma.kategoriFoto.create({
    data: {
      nama_kategori,
      dibuat_oleh: dibuat_oleh || null,
    },
  });
  return kategoriBaru;
};

// ✅ Update kategori
exports.updateKategori = async (id, nama_kategori) => {
  const updated = await prisma.kategoriFoto.update({
    where: { id_kategori: Number(id) },
    data: { nama_kategori },
  });
  return updated;
};

// ✅ Hapus kategori
exports.deleteKategori = async (id) => {
  const deleted = await prisma.kategoriFoto.delete({
    where: { id_kategori: Number(id) },
  });
  return deleted;
};