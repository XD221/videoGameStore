const express = require('express');
const router = express.Router();

// Controller
const controller = require('../controller/clienteController');

// Cliente
router.get('/', controller.get);
router.get('/obtener', controller.obtener);
router.get('/obtenerConAnonimo', controller.obtenerConAnonimo);
router.post('/guardar', controller.guardar);
router.post('/eliminar', controller.eliminar);

module.exports = router;