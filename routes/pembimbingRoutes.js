const express = require("express");
const router = express.Router();
const controller = require("../controllers/pembimbingController");
const upload = require("../middleware/upload"); // pastikan middleware ini ada dan menangani field foto_pembimbing

router.get("/", controller.getAllPembimbing);
router.get("/:id", controller.getPembimbingById);
router.post("/", upload.single("foto_pembimbing"), controller.createPembimbing);
router.put("/:id", upload.single("foto_pembimbing"), controller.updatePembimbing);
router.delete("/:id", controller.deletePembimbing);

module.exports = router;