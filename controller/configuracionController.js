const path = require("path");
const classModel = require("../model/sessionModel");
const model = new classModel();

module.exports = {
  get: function (req, res) {
    res.render("configuracion", { title: "Configuracion"});
  },

  modificarpass: function (req, res) {
    var data = {
      passwd: req.body.passwd,
      id: req.body.id
    };
    if (data.id != 0) {
      //nuevo
      model
        .modificarpass(data)
        .then((result) => {
          res.json({ Success: true, Data: result.id });
        })
        .catch((err) => {
          res.json({ Success: false, Message: err.message });
        });
    }
  },
};
