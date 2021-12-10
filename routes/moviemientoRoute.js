const express = require('express');
const router = express.Router();

// Controller
const controller = require('../controller/movimientoController');

// Movimiento
router.get('/', function(req, res){
    if(req.baseUrl == '/compra'){
        return controller.getCompra(req, res);
    }else if(req.baseUrl == '/venta'){
        return controller.getVenta(req, res)
    }
});
router.post('/seleccionar-proveedor', function(req, res){
    if(req.baseUrl == '/compra'){
        return controller.getSeleccionarProveedor(req, res);
    }
});
router.post('/seleccionar-cliente', function(req, res){
    if(req.baseUrl == '/venta'){
        return controller.getSeleccionarCliente(req, res);
    }
});
router.post('/seleccionar-producto', function(req, res){
    if(req.baseUrl == '/compra'){
        return controller.getSeleccionarProducto(req, res, 1);
    }else if(req.baseUrl == '/venta'){
        return controller.getSeleccionarProducto(req, res, 2);
    }
});
router.post('/agregar', function(req, res) {
    if(req.baseUrl == '/compra'){
        return controller.agregarCompra(req, res);
    }else if(req.baseUrl == '/venta'){
        return controller.agregarVenta(req, res);
    }
});
router.delete('/agregar', function(req, res) {
    if(req.baseUrl == '/compra'){
        return controller.eliminarCompra(req, res);
    }else if(req.baseUrl == '/venta'){
        return controller.eliminarVenta(req, res);
    }
});
router.get('/obtener', function(req, res){
    if(req.baseUrl == '/compra'){
        return controller.obtener(req, res, 1);
    }else if(req.baseUrl == '/venta'){
        return controller.obtener(req, res, 2);
    }
});
router.post('/obtenerDetalle', function(req, res){
    return controller.obtenerDetalle(req, res);
});
router.post('/guardar', function(req, res){
    if(req.baseUrl == '/compra'){
        return controller.guardar(req, res, 1);
    }else if(req.baseUrl == '/venta'){
        return controller.guardar(req, res, 2);
    }
}); 

module.exports = router;