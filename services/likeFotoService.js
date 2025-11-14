const prisma = require("../config/db");

// ==============================
// Dapatkan jumlah like untuk satu foto
// ==============================
exports.getLikeCount = async (id_foto) => {
  const count = await prisma.likeFoto.count({
    where: { id_foto: Number(id_foto) },
  });
  return { total_like: count };
};

// ==============================
// Dapatkan jumlah total like di semua foto yang diupload user
// ==============================
exports.getLikeCountByUser = async (user_id) => {
  const total = await prisma.likeFoto.count({
    where: {
      foto: {
        diupload_oleh: Number(user_id),
      },
    },
  });
  return { total };
};

// ==============================
// Statistik like berdasarkan tanggal (interval dalam hari)
exports.getLikeStats = async (userId, interval) => {
  const days = Number(interval.replace("d", "")) || 7;

  // Ambil data like dari DB
  const rows = await prisma.$queryRaw`
    SELECT 
      DATE(lf.tanggal_like) AS date,
      COUNT(*) AS total
    FROM LikeFoto lf
    JOIN FotoGaleri fg ON fg.id_foto = lf.id_foto
    WHERE fg.diupload_oleh = ${Number(userId)}
      AND lf.tanggal_like >= DATE_SUB(CURDATE(), INTERVAL ${days - 1} DAY)
    GROUP BY DATE(lf.tanggal_like)
    ORDER BY date ASC;
  `;

  // Map cepat: { "2025-11-11": 2, "2025-11-12": 3 }
  const likeMap = {};
  rows.forEach(r => {
    const key = r.date.toISOString().split("T")[0];
    likeMap[key] = Number(r.total);
  });

  // Generate range tanggal lengkap
  const result = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(today.getDate() - (days - 1));

  let current = new Date(start);

  while (current <= today) {
    const key = current.toISOString().split("T")[0];
    result.push({
      date: key,
      total: likeMap[key] || 0, // isi 0 kalau tidak ada like
    });
    current.setDate(current.getDate() + 1);
  }

  return result;
};


// ==============================
// Cek apakah user sudah like foto tertentu
// ==============================
exports.checkUserLike = async (id_foto, id_user) => {
  const like = await prisma.likeFoto.findUnique({
    where: {
      id_foto_id_user: {
        id_foto: Number(id_foto),
        id_user: Number(id_user),
      },
    },
  });
  return like ? true : false;
};

// ==============================
// Tambahkan like baru (hindari duplikasi otomatis oleh Prisma)
// ==============================
exports.addLike = async (id_foto, id_user) => {
  try {
    const like = await prisma.likeFoto.create({
      data: {
        id_foto: Number(id_foto),
        id_user: Number(id_user),
      },
    });
    return { success: true, like };
  } catch (err) {
    if (err.code === "P2002") {
      // Unique constraint failed (user sudah like)
      return { success: false, message: "User sudah memberikan like" };
    }
    throw err;
  }
};

// ==============================
// Hapus like
// ==============================
exports.removeLike = async (id_foto, id_user) => {
  await prisma.likeFoto.delete({
    where: {
      id_foto_id_user: {
        id_foto: Number(id_foto),
        id_user: Number(id_user),
      },
    },
  });
  return { success: true };
};

// ==============================
// Alias fungsi checkLike (sama seperti checkUserLike)
// ==============================
exports.checkLike = async (id_foto, id_user) => {
  return await exports.checkUserLike(id_foto, id_user);
};