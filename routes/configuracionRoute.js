const express = require('express');
const router = express.Router();

// Controller
const controller = require('../controller/configuracionController');

// Categoria
router.get('/', controller.get);
router.post('/modificar', controller.modificarpass);

module.exports = router;