const express = require('express');
const router = express.Router();

// Controller
const controller = require('../controller/marcaController');

// Marca
router.get('/', controller.get);
router.get('/obtener', controller.obtener);
router.post('/guardar', controller.guardar);
router.post('/eliminar', controller.eliminar);

module.exports = router;