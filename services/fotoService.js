const prisma = require("../config/db");
const cloudinary = require("../config/cloudinary");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

// ==============================
// AMBIL SEMUA FOTO (dengan filter uploader opsional)
// ==============================
exports.getAllFoto = async (uploader_id) => {
  const where = uploader_id ? { diupload_oleh: Number(uploader_id) } : {};

  const fotos = await prisma.fotoGaleri.findMany({
    where,
    include: {
      kategori: { select: { nama_kategori: true } }, // ✅ relasi ke model KategoriFoto
      uploader: { select: { username: true } }, // ✅ relasi ke User
      likes: true, // ✅ relasi ke LikeFoto
    },
    orderBy: { tanggal_upload: "desc" },
  });

  return fotos.map((f) => ({
    id_foto: f.id_foto,
    id_kategori: f.id_kategori,
    url_foto: f.url_foto,
    deskripsi: f.deskripsi,
    tanggal_upload: f.tanggal_upload,
    nama_kategori: f.kategori?.nama_kategori || "-",
    uploader: f.uploader?.username || "Admin",
    like_count: f.likes.length,
  }));
};

// ==============================
// AMBIL FOTO BERDASARKAN UPLOADER
// ==============================
exports.getFotoByUploader = async (user_id) => {
  const fotos = await prisma.fotoGaleri.findMany({
    where: { diupload_oleh: Number(user_id) },
    include: {
      kategori: { select: { nama_kategori: true } },
      uploader: { select: { username: true } },
      likes: true,
    },
    orderBy: { tanggal_upload: "desc" },
  });

  return fotos.map((f) => ({
    id_foto: f.id_foto,
    id_kategori: f.id_kategori,
    url_foto: f.url_foto,
    deskripsi: f.deskripsi,
    tanggal_upload: f.tanggal_upload,
    nama_kategori: f.kategori?.nama_kategori || "-",
    uploader: f.uploader?.username || "Admin",
    like_count: f.likes.length,
  }));
};

// ==============================
// HITUNG JUMLAH FOTO USER
// ==============================
exports.getFotoCountByUser = async (user_id) => {
  const count = await prisma.fotoGaleri.count({
    where: { diupload_oleh: Number(user_id) },
  });
  return count;
};

// ==============================
// AMBIL FOTO BY ID
// ==============================
exports.getFotoById = async (id) => {
  const foto = await prisma.fotoGaleri.findUnique({
    where: { id_foto: Number(id) },
    include: {
      kategori: { select: { nama_kategori: true } },
      uploader: { select: { username: true } },
    },
  });

  if (!foto) return null;

  return {
    ...foto,
    nama_kategori: foto.kategori?.nama_kategori || "-",
    uploader: foto.uploader?.username || "Admin",
  };
};

// ==============================
// TAMBAH FOTO BARU
// ==============================
exports.createFoto = async (data) => {
  const { id_kategori, url_foto, deskripsi, diupload_oleh } = data;
  const result = await prisma.fotoGaleri.create({
    data: {
      id_kategori,
      url_foto,
      deskripsi,
      diupload_oleh,
    },
  });
  return result;
};

// ==============================
// UPDATE FOTO
// ==============================
exports.updateFoto = async (id, id_kategori, deskripsi, newFoto) => {
  const foto = await prisma.fotoGaleri.findUnique({
    where: { id_foto: Number(id) },
  });

  if (!foto) throw new Error("Foto tidak ditemukan");

  const oldFoto = foto.url_foto;
  const fotoToSave = newFoto || oldFoto;

  if (newFoto && oldFoto) {
    const oldPath = path.join(__dirname, "../uploads/galeri", oldFoto);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  const updated = await prisma.fotoGaleri.update({
    where: { id_foto: Number(id) },
    data: {
      id_kategori,
      url_foto: fotoToSave,
      deskripsi,
    },
  });

  return updated;
};

// ==============================
// HAPUS FOTO
// ==============================
exports.deleteFoto = async (id) => {
  const fotoId = Number(id);
  const foto = await prisma.fotoGaleri.findUnique({
    where: { id_foto: fotoId },
  });

  if (!foto) throw new Error("Foto tidak ditemukan");

  try {
    // Hapus dulu semua data terkait yang punya FK ke foto.id_foto
    // Ganti nama model jika schema Prisma-mu berbeda
    await prisma.$transaction([
      // hapus likes terkait
      prisma.likeFoto.deleteMany({ where: { id_foto: fotoId } }),
      // hapus komentar terkait
      prisma.komentarFoto.deleteMany({ where: { id_foto: fotoId } }),
      // jika ada tabel lain yang mereferensikan foto, hapus juga di sini
    ]);

    // setelah child dihapus, hapus foto
    await prisma.fotoGaleri.delete({
      where: { id_foto: fotoId },
    });

    return { success: true };
  } catch (err) {
    console.error("❌ Gagal menghapus foto:", err);
    throw new Error("Gagal menghapus foto; cek log server untuk detail.");
  }
};

// ==============================
// HITUNG TOTAL SEMUA FOTO
// ==============================
exports.getFotoCount = async () => {
  const count = await prisma.fotoGaleri.count();
  return count;
};

// ==============================
// GENERATE PDF REPORT
// ==============================
exports.generatePdfReport = async (limit, res) => {
  const rows = await prisma.fotoGaleri.findMany({
    include: {
      kategori: { select: { nama_kategori: true } },
      uploader: { select: { username: true } },
      likes: true,
    },
    orderBy: [
      { likes: { _count: "desc" } },
      { tanggal_upload: "desc" },
    ],
    take: Number(limit),
  });

  try {
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const filename = `laporan_foto_top_${limit}.pdf`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(18).font("Helvetica-Bold").text(`Laporan Foto: Top ${limit}`, { align: "center" });
    doc.fontSize(10).font("Helvetica").text(`Tanggal: ${new Date().toLocaleString()}`, { align: "center" });
    doc.moveDown(1);

    if (rows.length === 0) {
      doc.text("Tidak ada data foto untuk dilaporkan.", { align: "center" });
      doc.end();
      return;
    }

    // tampilkan top 1 foto
    const top = rows[0];
    const imagePath = path.join(__dirname, "../uploads/galeri", top.url_foto || "");
    if (top.url_foto && fs.existsSync(imagePath)) {
      try {
        doc.image(imagePath, { fit: [480, 260], align: "center" });
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold").fontSize(12).text(top.deskripsi || "(Tanpa deskripsi)", { align: "center" });
        doc.font("Helvetica").fontSize(10).text(
          `Likes: ${top.likes.length} • Kategori: ${top.kategori?.nama_kategori || "-"} • Uploader: ${top.uploader?.username || "Admin"}`,
          { align: "center" }
        );
        doc.moveDown(1);
      } catch {
        doc.text("(Gagal menampilkan gambar)", { align: "center" });
      }
    }

    // header tabel
    const columns = { no: 40, deskripsi: 80, kategori: 290, likes: 380, uploader: 440, tanggal: 520 };
    const startY = doc.y + 10;
    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("No", columns.no, startY);
    doc.text("Deskripsi", columns.deskripsi, startY);
    doc.text("Kategori", columns.kategori, startY);
    doc.text("Likes", columns.likes, startY);
    doc.text("Uploader", columns.uploader, startY);
    doc.text("Tanggal", columns.tanggal, startY);
    doc.moveTo(40, startY + 15).lineTo(560, startY + 15).stroke();

    let y = startY + 20;
    doc.font("Helvetica").fontSize(9);
    rows.forEach((r, idx) => {
      doc.text(idx + 1, columns.no, y);
      doc.text(r.deskripsi || "-", columns.deskripsi, y, { width: 200 });
      doc.text(r.kategori?.nama_kategori || "-", columns.kategori, y);
      doc.text(String(r.likes.length), columns.likes, y);
      doc.text(r.uploader?.username || "Admin", columns.uploader, y);
      doc.text(new Date(r.tanggal_upload).toLocaleDateString(), columns.tanggal, y);
      y += 18;
      if (y > 750) {
        doc.addPage();
        y = 50;
      }
    });

    doc.end();
  } catch (pdfErr) {
    throw pdfErr;
  }
};