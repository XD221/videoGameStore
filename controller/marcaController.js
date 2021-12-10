const path = require("path");
const classModel = require("../model/marcaModel");
const model = new classModel();

module.exports = {
  get: function (req, res) {
    res.render("marca", { title: "Marca" });
  },

  obtener: function (req, res) {
    model
        .obtener()
        .then((filas) => {
          res.json({ Success: true, Data: filas });
        })
        .catch((err) => {
          res.json({ Success: false, Message: err.message });
        });
  },

  guardar: function (req, res) {
    var data = {
      id: req.body.id,
      nombre: req.body.nombre,
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