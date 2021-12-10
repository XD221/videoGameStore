const path = require("path");
const classModel = require("../model/empleadoModel");
const model = new classModel();

module.exports = {
  get: function (req, res) {
    res.render("empleado", { title: "Empleado" });
  },

  obtener: function (req, res) {
    if (req.session.userID) {
      model
        .obtener()
        .then((filas) => {
          res.json({ Success: true, Data: filas });
        })
        .catch((err) => {
          res.json({ Success: false, Message: err.message });
        });
    }

    res.redirect("/login");
  },

  guardar: function (req, res) {
    var data = {
      id: req.body.id,
      ci: req.body.ci,
      nombre: req.body.nombre,
      apPaterno: req.body.apPaterno,
      apMaterno: req.body.apMaterno,
      telefono: req.body.telefono,
      direccion: req.body.direccion,
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
