const dao = require("./dao");
const objDao = new dao();

class Model {
  


  constructor(id = usuario, nombre, url, tipoUsuario) {
    this.id = id;
    this.usuario = usuario;
    this.nombre = nombre;
    this.url = url;
    this.tipoUsuario = tipoUsuario;
  }

  obtener() {
    var sql = "SELECT * FROM usuario";
    var params = [];
    return objDao.all(sql, params);
  }
}

module.exports = Model;
