const path = require("path");

const classModel = require("../model/productoModel");
const classModelAux = require("../model/categoriaModel");
const classModelAux2 = require("../model/marcaModel");

const model = new classModel();
const modelAux = new classModelAux();
const modelAux2 = new classModelAux2();
//obtenerReal
module.exports = {
  get: function (req, res) {
    res.render("producto", { title: 'Producto' });
  },

  obtener: function (req, res) {
    model
        .obtener()
        .then((filas) => {
          modelAux
            .obtener()
            .then((filas2) => {
              modelAux2
                .obtener()
                .then((filas3) => {
                  res.json({
                    Success: true,
                    Data: { Producto: filas, Categoria: filas2, Marca: filas3 },
                  });
                })
                .catch((err) => {
                  res.json({ Success: false, Message: err.message });
                });
            })
            .catch((err) => {
              res.json({ Success: false, Message: err.message });
            });
        })
        .catch((err) => {
          res.json({ Success: false, Message: err.message });
        });
  },

  guardar: function (req, res) {
    var data = {
      id: req.body.id,
      nombre: req.body.nombre,
      urlIMG: req.body.urlIMG,
      precio: req.body.precio,
      cantidad: req.body.cantidad,
      id_categoria: req.body.id_categoria,
      id_marca: req.body.id_marca,
    };
    if (data.id == 0) {
      //nuevo
      model
        .guardar(data)
        .then((result) => {
          res.json({ Success: true, Data: result.id });
        })
        .catch((err) => {
          res.json({ Success: false, Message: err.message });
        });
    } else {
      //actualizar
      model
        .modificar(data)
        .then((result) => {
          res.json({ Success: true, Data: result.id });
        })
        .catch((err) => {
          res.json({ Success: false, Message: err.message });
        });
    }
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
