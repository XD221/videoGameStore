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
    res.locals.data = req.user.compra;
    modelAux
    .obtenerDisponible()
    .then((proveedor) => {
      modelAux2
      .obtenerCompra()
      .then((producto) => {
        res.render("compra-agregar", { title: 'Agregar Compra', proveedor: proveedor, producto: producto});
      })
      .catch((err) => {
        res.render("compra-agregar", { title: 'Agregar Compra', proveedor: proveedor, producto: []});
      }); 
    })
    .catch((err) => {
      res.render("compra-agregar", { title: 'Agregar Compra', proveedor: [], producto: []});
    });
  },

  agregarVenta: function (req, res) {
    res.locals.data = req.user.venta;
    modelAux3
    .obtenerConAnonimo()
    .then((cliente) => {
      modelAux2
      .obtenerReal()
      .then((producto) => {
        res.render("venta-agregar", { title: 'Agregar Venta', cliente: cliente, producto: producto });
      })
      .catch((err) => {
        res.render("venta-agregar", { title: 'Agregar Venta', cliente: cliente, producto: [] });
      }); 
    })
    .catch((err) => {
      res.render("venta-agregar", { title: 'Agregar Venta', cliente: [], producto: [] });
    });
  },

  eliminarProductoCompra: function (req, res) {
    if((req.body.prodID).toString() in req.user.compra){
      delete req.user.compra[(req.body.prodID).toString()];
      res.json({ Success: true });
    }else{
      res.json({ Success: false });
    }
  },

  agregarProductoCompra: function (req, res) {
    if(req.body.prodID != undefined) {
      req.user.compra[(req.body.prodID).toString()] = { nombre: req.body.prodNombre, precio: parseFloat(req.body.precio), cantidad: req.body.cantidad, categoria: req.body.categoria, marca: req.body.marca };
      res.json({ Success: true });
    }else{
      res.json({ Success: false });
    }
  },

  eliminarProductoVenta: function (req, res) {
    if((req.body.prodID).toString() in req.user.venta){
      delete req.user.venta[(req.body.prodID).toString()];
      res.json({ Success: true });
    }else{
      res.json({ Success: false });
    }
  },

  agregarProductoVenta: function (req, res) {
    if(req.body.prodID != undefined) {
      req.user.venta[(req.body.prodID).toString()] = { nombre: req.body.prodNombre, precio: req.body.precio, cantidad: req.body.cantidad, categoria: req.body.categoria, marca: req.body.marca };
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

  guardar: function (req, res, typeofData) {
    var redirectValue;
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
              for (var key in req.user.compra) {
                var element = req.user.compra[key];
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
              for (var key in req.user.venta) {
                var element = req.user.venta[key];
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
      if (typeofData == 1) {
        redirectValue = '/compra';
        for (var prop in req.user.compra) {
          if (req.user.compra.hasOwnProperty(prop)) {
              delete req.user.compra[prop];
          }
        }
      } else if (typeofData == 2) {
        redirectValue = '/venta';
        for (var prop in req.user.venta) {
          if (req.user.venta.hasOwnProperty(prop)) {
              delete req.user.venta[prop];
          }
        }
      }
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

  anularCompra(req, res){
    return new promise((resolve, reject) => {
      transaction().then((tt) => {
        existTransaction().then(() => {
          var sql = "UPDATE movimiento SET estado=1 WHERE id=? and estado=0";
          var params = [
            req.body.id
          ];
          queryTransaction(sql, params, tt, 1).then(async (mov) => {
            if(mov[1] <= 0){
              console.error("Query error: Does not meet the necessary requirements");
              tt.rollback();
              reject( `El movimiento ya esta Anulado` );
            }else{
              sql = "SELECT d.cantidad, d.id_producto, p.nombre as producto FROM detalleMovimiento as d, producto as p WHERE id_movimiento=? AND p.id = d.id_producto";
              params = [
                req.body.id
              ];
              await queryTransaction(sql, params, tt, 2).then(async (detalle) => {
                for(d of detalle){
                  sql = "UPDATE producto SET cantidad = cantidad - ? WHERE cantidad >= ? AND id=?";
                  params = [
                    d.cantidad,
                    d.cantidad,
                    d.id_producto
                  ];
                  await queryTransaction(sql, params, tt, 1).then(async (result) => {
                    if(result[1] <= 0){
                      console.error("Query error: Does not meet the necessary requirements");
                      tt.rollback();
                      reject( `La cantidad del producto "${d.producto}" no esta disponible` );
                    }
                  }).catch((err) => {
                    console.error('Query error: ' + err);
                    tt.rollback();
                    reject(err.message);
                  });
                }
                tt.commit();
                resolve( req.body.id );
              }); 
            }
          }).catch((err) => {
            console.error('Query error: ' + err);
            tt.rollback();
            reject(err.message);
          });
        }).catch((err) => {
          console.error("Error in the sql");
          console.error(err.message);
          tt.rollback();
          reject(err.message);
        });
      }).catch((err) => {
        console.error('Query error: ' + err);
        tt.rollback();
        reject(err.message);
      });
    }).then((result) => {
      res.json({ Success: true });
    }).catch((err) => {
      res.json( { Success: false, Message: err } );
    });
  },

};
