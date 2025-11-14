const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const pembinatController = require("../controllers/pembinatController");

router.get("/", pembinatController.getAllPembinat);
router.post("/", upload.single("gambar_pekerjaan"), pembinatController.createPembinat);
router.put("/:id", upload.single("gambar_pekerjaan"), pembinatController.updatePembinat);
router.delete("/:id", pembinatController.deletePembinat);

module.exports = router;