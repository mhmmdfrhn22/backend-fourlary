require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// ==========================
// 🌐 MIDDLEWARE GLOBAL
// ==========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static folder untuk file upload
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==========================
// 📦 ROUTES IMPORT
// ==========================
const roleRoutes = require("./routes/roleRoutes");
const userRoutes = require("./routes/userRoutes");
const kategoriRoutes = require("./routes/kategori");
const postsRoutes = require("./routes/posts");
const jurusanRoutes = require("./routes/jurusanRoutes");
const pembimbingRoutes = require("./routes/pembimbingRoutes");
const pembinatRoutes = require("./routes/pembinatRoutes");
const uploadRoutes = require("./routes/upload");
const fotoRoutes = require("./routes/fotoRoutes");
const kategoriFotoRoutes = require("./routes/kategoriFotoRoutes");
const komentarFotoRoutes = require("./routes/komentarFotoRoutes");
const likeFotoRoutes = require("./routes/likeFotoRoutes");
const guruRoutes = require("./routes/guruRoute");

// 👇 Tambahin ini
console.log({
  roleRoutes,
  userRoutes,
  kategoriRoutes,
  postsRoutes,
  jurusanRoutes,
  pembimbingRoutes,
  pembinatRoutes,
  uploadRoutes,
  fotoRoutes,
  kategoriFotoRoutes,
  komentarFotoRoutes,
  likeFotoRoutes,
  guruRoutes,
});


// ==========================
// 🛣️ ROUTES SETUP
// ==========================
app.use("/api/user", userRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/kategori", kategoriRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/jurusan", jurusanRoutes);
app.use("/api/pembimbing", pembimbingRoutes);
app.use("/api/pembinat", pembinatRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/foto", fotoRoutes);
app.use("/api/kategori-foto", kategoriFotoRoutes);
app.use("/api/komentar-foto", komentarFotoRoutes);
app.use("/api/like-foto", likeFotoRoutes);
app.use("/api/guru", guruRoutes);

// ==========================
// 🚀 SERVER START
// ==========================
app.listen(port, () => {
console.log(`✅ Server berjalan di http://localhost:${port}`);
console.log("Cihuyyyy 🚀");
});