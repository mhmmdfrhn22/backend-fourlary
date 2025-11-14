const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // ✅ pakai config utama

// ✅ Setup penyimpanan Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const url = req.originalUrl || "";
    let folder = "general";

    if (url.includes("guru")) folder = "guru";
    else if (url.includes("foto")) folder = "galeri";
    else if (url.includes("posts")) folder = "berita";
    else if (url.includes("pembimbing")) folder = "pembimbing";
    else if (url.includes("pembinat")) folder = "pembinat";

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/\s+/g, "_");

    return {
      folder: `uploads/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      public_id: `${uniqueSuffix}_${safeName}`,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
      resource_type: "image",
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("❌ Hanya file gambar (JPG, PNG, WEBP) yang diperbolehkan!"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
