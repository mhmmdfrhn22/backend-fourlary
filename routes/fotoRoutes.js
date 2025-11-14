// routes/fotoRoutes.js
const express = require("express");
const router = express.Router();
const fotoCtrl = require("../controllers/fotoController");
const upload = require("../middleware/upload");

// ✅ Routes
router.get("/count", fotoCtrl.getFotoCount);
router.get("/laporan/pdf", fotoCtrl.generatePdfReport);
router.get("/user", fotoCtrl.getFotoByUploader);           // 🔹 pindah ke atas
router.get("/count/:user_id", fotoCtrl.getFotoCountByUser); // 🔹 juga ke atas
router.get("/", fotoCtrl.getAllFoto);
router.get("/:id", fotoCtrl.getFotoById);

router.post("/", (req, res, next) => {
  upload.single("foto")(req, res, (err) => {
    if (err) {
      console.error("⚠️ Multer Error:", err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, fotoCtrl.createFoto);

router.put("/:id", upload.single("foto"), fotoCtrl.updateFoto);
router.delete("/:id", fotoCtrl.deleteFoto);

module.exports = router;
