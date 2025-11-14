const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary");

const uploadDir = path.join(__dirname, "../uploads/pembinat");

// 🔹 GET semua pembinat
exports.getAllPembinat = async () => {
  try {
    const pembinat = await prisma.pembinatPekerjaan.findMany({
      include: {
        jurusan: { select: { nama_jurusan: true } },
        pembimbing: { select: { nama: true } },
      },
      orderBy: { created_at: "desc" },
    });

    return pembinat.map((p) => ({
      ...p,
      nama_jurusan: p.jurusan ? p.jurusan.nama_jurusan : null,
      nama_pembimbing: p.pembimbing ? p.pembimbing.nama : null,
    }));
  } catch (err) {
    throw err;
  }
};

// 🔹 CREATE pembinat
exports.createPembinat = async (data) => {
  const { nama_pekerjaan, deskripsi, id_jurusan, id_pembimbing, gambar_pekerjaan } = data;

  try {
    const pembinat = await prisma.pembinatPekerjaan.create({
      data: {
        nama_pekerjaan,
        deskripsi,
        gambar_pekerjaan,
        id_jurusan: id_jurusan ? Number(id_jurusan) : null,
        id_pembimbing: id_pembimbing ? Number(id_pembimbing) : null,
      },
    });

    return pembinat.id_pekerjaan;
  } catch (err) {
    throw err;
  }
};

// 🔹 UPDATE pembinat (hapus gambar lama Cloudinary jika diganti)
exports.updatePembinat = async (id, data) => {
  const { nama_pekerjaan, deskripsi, id_jurusan, id_pembimbing, gambarBaru } = data;

  try {
    const existing = await prisma.pembinatPekerjaan.findUnique({
      where: { id_pekerjaan: Number(id) },
    });

    if (!existing) return null;

    // 🔸 Hapus gambar lama (Cloudinary atau lokal)
    if (gambarBaru && existing.gambar_pekerjaan) {
      const oldUrl = existing.gambar_pekerjaan;

      // Jika URL Cloudinary, hapus lewat API
      if (oldUrl.startsWith("http")) {
        try {
          const publicId = oldUrl
            .split("/")
            .slice(-2)
            .join("/")
            .replace(/\.[^.]+$/, ""); // ambil path 'uploads/pembinat/xxxxxx' tanpa ekstensi
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {
          console.warn("⚠️ Gagal hapus gambar lama di Cloudinary:", e.message);
        }
      } else {
        // Kalau masih file lokal
        const oldPath = path.join(uploadDir, oldUrl);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (e) {
            console.warn("⚠️ Gagal hapus file lokal:", e);
          }
        }
      }
    }

    // 🔸 Update data
    await prisma.pembinatPekerjaan.update({
      where: { id_pekerjaan: Number(id) },
      data: {
        nama_pekerjaan,
        deskripsi,
        id_jurusan: id_jurusan ? Number(id_jurusan) : null,
        id_pembimbing: id_pembimbing ? Number(id_pembimbing) : null,
        ...(gambarBaru && { gambar_pekerjaan: gambarBaru }),
      },
    });

    return true;
  } catch (err) {
    throw err;
  }
};

// 🔹 DELETE pembinat
exports.deletePembinat = async (id) => {
  try {
    const existing = await prisma.pembinatPekerjaan.findUnique({
      where: { id_pekerjaan: Number(id) },
    });
    if (!existing) return null;

    // Hapus gambar jika ada
    if (existing.gambar_pekerjaan) {
      const oldUrl = existing.gambar_pekerjaan;

      if (oldUrl.startsWith("http")) {
        try {
          const publicId = oldUrl
            .split("/")
            .slice(-2)
            .join("/")
            .replace(/\.[^.]+$/, "");
          await cloudinary.uploader.destroy(publicId);
        } catch (e) {
          console.warn("⚠️ Gagal hapus gambar di Cloudinary:", e.message);
        }
      } else {
        const filePath = path.join(uploadDir, oldUrl);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.warn("⚠️ Gagal hapus file lokal:", e);
          }
        }
      }
    }

    // Hapus data dari DB
    await prisma.pembinatPekerjaan.delete({
      where: { id_pekerjaan: Number(id) },
    });

    return true;
  } catch (err) {
    throw err;
  }
};
