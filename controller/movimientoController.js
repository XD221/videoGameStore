const path = require("path");
const promise = require("bluebird");
const db = require("../database.js");
const { existTransaction, queryTransaction, transaction } = require('../model/transaction');

const classModel = require("../model/movimientoModel");
const classModelAux = require("../model/proveedorModel");
const classModelAux2 = require("../model/productoModel");
const classModelAux3 = require("../model/clienteModel");

const model = new classModel();
const modelAux = new classModelAux();
const modelAux2 = new classModelAux2();
const modelAux3 = new classModelAux3();

module.exports = {
  getCompra: function (req, res) {
    res.render("compra", { title: 'Compra' });
  },

  getVenta: function (req, res) {
    res.render("venta", { title: 'Venta' });
  },

  agregarCompra: function (req, res) {
    if(req.body.prodID != undefined) {
      req.user.compra[(req.body.prodID).toString()] = { nombre: req.body.prodNombre, precio: parseFloat(req.body.precio), cantidad: req.body.cantidad, categoria: req.body.categoria, marca: req.body.marca };
    }
    res.locals.producto = req.user.compra;
    res.render("compra-agregar", { title: 'Agregar Compra', prNombre: (req.body.prNombre === undefined) ? "" : req.body.prNombre, prID: (req.body.prID === undefined) ? "" : req.body.prID});
  },

  agregarVenta: function (req, res) {
    if(req.body.prodID != undefined) {
      req.user.venta[(req.body.prodID).toString()] = { nombre: req.body.prodNombre, precio: req.body.precio, cantidad: req.body.cantidad, categoria: req.body.categoria, marca: req.body.marca };
    }
    res.locals.producto = req.user.venta;
    res.render("venta-agregar", { title: 'Agregar Venta', clNombre: (req.body.clNombre === undefined) ? "" : req.body.clNombre, clID: (req.body.clID === undefined) ? "" : req.body.clID});
  },

  eliminarCompra: function (req, res) {
    if((req.body.prodID).toString() in req.user.compra){
      delete req.user.compra[(req.body.prodID).toString()];
      res.json({ Success: true });
    }else{
      res.json({ Success: false });
    }
  },

  eliminarVenta: function (req, res) {
    if((req.body.prodID).toString() in req.user.venta){
      delete req.user.venta[(req.body.prodID).toString()];
      res.json({ Success: true });
    }else{
      res.json({ Success: false });
    }
  },

  obtener: function (req, res, typeofData) {
    model
        .obtener(typeofData)
        .then((filas) => {
          res.json({
            Success: true,
            Data: filas
          });
        })
        .catch((err) => {
          res.json({ Success: false, Message: err.message });
        });
  },

  obtenerDetalle: function (req, res) {
    var data = { id: req.body.id };
    model
        .obtenerDetalle(data)
        .then((filas) => {
          res.json({
            Success: true,
            Data: filas
          });
        })
        .catch((err) => {
          res.json({ Success: false, Message: err.message });
        });
  },

  getSeleccionarProveedor: function (req, res) {
    modelAux
    .obtenerDisponible()
    .then((filas) => {
      res.render("compra-proveedor", { title: 'Seleccionar Proveedor', data: filas, prNombre: (req.body.proveedor === undefined) ? "" : req.body.proveedor, prID: (req.body.proveedorID === undefined) ? "" : req.body.proveedorID });
    })
    .catch((err) => {
      res.render("compra-proveedor", { title: 'Seleccionar Proveedor', message: err.message, prNombre: (req.body.proveedor === undefined) ? "" : req.body.proveedor, prID: (req.body.proveedorID === undefined) ? "" : req.body.proveedorID });
    });
  },

  getSeleccionarCliente: function (req, res) {
    modelAux3
    .obtenerConAnonimo()
    .then((filas) => {
      res.render("venta-cliente", { title: 'Seleccionar Cliente', data: filas, clNombre: (req.body.cliente === undefined) ? "" : req.body.cliente, clID: (req.body.clienteID === undefined) ? "" : req.body.clienteID });
    })
    .catch((err) => {
      res.render("venta-cliente", { title: 'Seleccionar Cliente', message: err.message, clNombre: (req.body.cliente === undefined) ? "" : req.body.cliente, clID: (req.body.clienteID === undefined) ? "" : req.body.clienteID });
    });
  },

  getSeleccionarProducto: function (req, res, typeofData) {
    if(typeofData == 1){
      modelAux2
      .obtenerCompra()
      .then((filas) => {
        res.render("compra-producto", { title: 'Agregar Producto', data: filas, prNombre: (req.body.proveedor === undefined) ? "" : req.body.proveedor, prID: (req.body.proveedorID === undefined) ? "" : req.body.proveedorID });
      })
      .catch((err) => {
        res.render("compra-producto", { title: 'Agregar Producto', message: err.message, prNombre: (req.body.proveedor === undefined) ? "" : req.body.proveedor, prID: (req.body.proveedorID === undefined) ? "" : req.body.proveedorID });
      }); 
    } else if(typeofData == 2){
      modelAux2
      .obtenerReal()
      .then((filas) => {
        res.render("venta-producto", { title: 'Agregar Producto', data: filas, clNombre: (req.body.cliente === undefined) ? "" : req.body.cliente, clID: (req.body.clienteID === undefined) ? "" : req.body.clienteID });
      })
      .catch((err) => {
        res.render("venta-producto", { title: 'Agregar Producto', message: err.message, clNombre: (req.body.cliente === undefined) ? "" : req.body.cliente, clID: (req.body.clienteID === undefined) ? "" : req.body.clienteID });
      }); 

    }
  },

  //guardar: function (req, res, typeofData) {
  //  var data;
  //    if (typeofData == 1) {
  //      data = {
  //        fecha: req.body.fecha,
  //        total: req.body.total,
  //        id_proveedor: req.body.proveedorID,
  //        id_empleado: req.user.id.split('.')[0],
  //      };
  //    } else if (typeofData == 2) {
  //      data = {
  //        fecha: req.body.fecha,
  //        total: req.body.total,
  //        id_cliente: req.body.clienteID,
  //        id_empleado: req.user.id.split('.')[0],
  //      };
  //    }
  //    model
  //    .guardar(data, typeofData)
  //    .then((result) => {
  //      if (typeofData == 1) {
  //        for (var key in req.user.compra) {
  //          var element = req.user.compra[key];
  //          data = {
  //            id_movimiento: result.id,
  //            id_producto: parseInt(key),
  //            cantidad: parseInt(element.cantidad),
  //            precio: (parseInt(element.precio) * parseInt(element.cantidad))
  //          };
  //          model
  //          .guardarDetalle(data)
  //          .then((result2) => {
  //            var lastID = result2.id;
  //          })
  //          .catch((err) => {
  //            res.json({ Success: false, Message: err.message });
  //            return;
  //          });
  //          data = {
  //            cantidad: parseInt(element.cantidad),
  //            id: parseInt(key)
  //          };
  //          modelAux2
  //          .incrementar(data)
  //          .then((result2) => {
  //            var lastID = result2.id;
  //          })
  //          .catch((err) => {
  //            res.json({ Success: false, Message: err.message });
  //            return;
  //          });
  //        }
  //        req.user.compra = {};
  //        res.redirect(301,'/compra');
  //      } else if (typeofData == 2) {
  //        for (var key in req.user.venta) {
  //          var element = req.user.venta[key];
  //          data = {
  //            id_movimiento: result.id,
  //            id_producto: parseInt(key),
  //            cantidad: parseInt(element.cantidad),
  //            precio: (parseInt(element.precio) * parseInt(element.cantidad))
  //          };
  //          model
  //          .guardarDetalle(data)
  //          .then((result2) => {
  //            var lastID = result2.id;
  //          })
  //          .catch((err) => {
  //            res.json({ Success: false, Message: err.message });
  //            return;
  //          });
  //          data = {
  //            cantidad: parseInt(element.cantidad),
  //            id: parseInt(key)
  //          };
  //          modelAux2
  //          .decrementar(data)
  //          .then((result2) => {
  //            var lastID = result2.id;
  //          })
  //          .catch((err) => {
  //            res.json({ Success: false, Message: err.message });
  //            return;
  //          });
  //        }
  //        req.user.venta = {};
  //        res.redirect(301,'/venta');
  //      }
  //    })
  //    .catch((err) => {
  //      res.json({ Success: false, Message: err.message });
  //    });
  //},
  guardar: function (req, res, typeofData) {
    var redirectValue;
    var items;
    if (typeofData == 1) {
      redirectValue = '/compra';
      items = req.user.compra;
      req.user.compra = {};
    } else if (typeofData == 2) {
      redirectValue = '/venta';
      items = req.user.venta;
      req.user.venta = {};
    }
    return new promise((resolve, reject) => {
      transaction().then((tt) => {
        existTransaction().then(() => {
          var sql;
          var params;
          if (typeofData == 1) {
            sql = "INSERT INTO movimiento (fecha, total, estado, id_proveedor, id_cliente, id_empleado, id_tipoMovimiento) VALUES ('?',?,0,?,0,?,1)";
            params = [
              req.body.fecha,
              req.body.total,
              req.body.proveedorID,
              req.user.id.split('.')[0]
            ];
          } else if (typeofData == 2) {
            sql = "INSERT INTO movimiento (fecha, total, estado, id_proveedor, id_cliente, id_empleado, id_tipoMovimiento) VALUES ('?',?,0,0,?,?,2)";
            params = [
              req.body.fecha,
              req.body.total,
              req.body.clienteID,
              req.user.id.split('.')[0]
            ];
          }
          queryTransaction(sql, params, tt, 0).then(async (data) => {
            var id_movimiento = data[0];
            if (typeofData == 1) {
              for (var key in items) {
                var element = items[key];
                sql = "INSERT INTO detalleMovimiento (id_movimiento, id_producto, cantidad, precio) VALUES (?,?,?,?)";
                params = [
                  id_movimiento,
                  parseInt(key),
                  parseInt(element.cantidad),
                  parseFloat(parseFloat(element.precio) * parseInt(element.cantidad))
                ];
                await queryTransaction(sql, params, tt, 0).then(async(data2) => { 
                  var sql = "UPDATE producto SET cantidad= cantidad + ? WHERE id=?";
                  var params = [
                    parseInt(element.cantidad),
                    parseInt(key)
                  ];
                  await queryTransaction(sql, params, tt, 1).then((data3) => {
                    var id_producto = data3[1];
                  }).catch((err) => {
                    console.error('Query error: ' + err);
                    tt.rollback();
                    reject(err);
                  });
                }).catch((err) => {
                  console.error('Query error: ' + err);
                  tt.rollback();
                  reject(err);
                });
              }
              tt.commit();
              resolve( id_movimiento );
            } else if (typeofData == 2) {
              for (var key in items) {
                var element = items[key];
                sql = "INSERT INTO detalleMovimiento (id_movimiento, id_producto, cantidad, precio) VALUES (?,?,?,?)";
                params = [
                  id_movimiento,
                  parseInt(key),
                  parseInt(element.cantidad),
                  (parseInt(element.precio) * parseInt(element.cantidad))
                ];
                await queryTransaction(sql, params, tt, 0).then(async(data2) => {
                  var id_detalleMovimiento = data2[1];
                  var sql = "UPDATE producto SET cantidad= cantidad - ? WHERE id=?";
                  var params = [
                    parseInt(element.cantidad),
                    parseInt(key)
                  ];
                  await queryTransaction(sql, params, tt, 1).then((data3) => {
                    var id_producto = data3[1];
                  }).catch((err) => {
                    console.error('Query error: ' + err);
                    tt.rollback();
                    reject(err);
                  });
                });
              }
              tt.commit();
              resolve( id_movimiento );
            }
          }).catch((err) => {
            console.error('Query error: ' + err);
            tt.rollback();
            reject(err);
          });
        }).catch((err) => {
          console.error("Error in the sql");
          console.error(err);
          tt.rollback();
          reject(err);
        });
      }).catch((err) => {
        console.error('Query error: ' + err);
        tt.rollback();
        reject(err);
      });
    }).then((result) => {
      res.redirect(301, redirectValue);
    }).catch((err) => {
      res.json({ Success: false, Message: err.message });
    });
  },
  eliminar: function (req, res) {
    var data = {
      id: req.body.id,
    };
    model
      .eliminar(data)
      .then((result) => {
        res.json({ Success: true, Data: result.id });
      })
      .catch((err) => {
        res.json({ Success: false, Message: err.message });
      });
  },
};
