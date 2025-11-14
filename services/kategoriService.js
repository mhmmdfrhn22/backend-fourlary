const prisma = require("../config/db");

// ✅ Ambil semua kategori
exports.getAllKategori = async () => {
  const kategori = await prisma.kategori.findMany({
    orderBy: { id: "desc" },
  });
  return kategori;
};

// ✅ Tambah kategori baru
exports.createKategori = async (judul) => {
  const kategoriBaru = await prisma.kategori.create({
    data: { judul },
  });
  return kategoriBaru;
};

// ✅ Ambil kategori berdasarkan ID
exports.getKategoriById = async (id) => {
  const kategori = await prisma.kategori.findUnique({
    where: { id: Number(id) },
  });
  return kategori;
};

// ✅ Update kategori
exports.updateKategori = async (id, judul) => {
  const updated = await prisma.kategori.update({
    where: { id: Number(id) },
    data: { judul },
  });
  return updated;
};

// ✅ Hapus kategori
exports.deleteKategori = async (id) => {
  const deleted = await prisma.kategori.delete({
    where: { id: Number(id) },
  });
  return deleted;
};