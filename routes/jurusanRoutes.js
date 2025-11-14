const express = require("express");
const router = express.Router();
const controller = require("../controllers/jurusanController");

router.get("/", controller.getAllJurusan);
router.post("/", controller.createJurusan);
router.put("/:id", controller.updateJurusan);
router.delete("/:id", controller.deleteJurusan);

module.exports = router;