const dao = require("./dao");
const objDao = new dao();

class Model {
  constructor() {}
  obtener() {
    var sql = "SELECT * FROM marca";
    var params = [];
    return objDao.all(sql, params);
  }

  guardar(data) {
    var sql = "INSERT INTO marca (nombre) VALUES (?)";
    var params = [data.nombre];
    return objDao.run(sql, params);
  }

  modificar(data) {
    var sql = "UPDATE marca SET nombre=? WHERE id=?";
    var params = [data.nombre, data.id];
    return objDao.run(sql, params);
  }

  eliminar(data) {
    var sql = "DELETE FROM marca WHERE id=?";
    var params = [data.id];
    return objDao.run(sql, params);
  }
}

module.exports = Model;
