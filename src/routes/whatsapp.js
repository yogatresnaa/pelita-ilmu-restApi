const express = require("express");

const Route = express.Router();
const whatsappController = require("../controllers/whatsapp");

Route.post("/", whatsappController.postMessage);

// .get('/status/:id', kelasController.getKelasByProdi)
//   .post('/', siswaController.postSiswa)
//   .put('/:id', siswaController.putSiswa)
//   .put('/status/:id', siswaController.putStatusSiswa)
//   .delete('/:id', siswaController.deleteSiswa);

module.exports = Route;
