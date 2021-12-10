const dao = require("./dao");
const objDao = new dao();

class Model {
  constructor() {}
  obtener() {
    var sql = "SELECT * FROM categoria";
    var params = [];
    return objDao.all(sql, params);
  }

  guardar(data) {
    var sql = "INSERT INTO categoria (nombre, descripcion) VALUES (?,?)";
    var params = [data.nombre, data.descripcion];
    return objDao.run(sql, params);
  }

  modificar(data) {
    var sql = "UPDATE categoria SET nombre=?, descripcion=? WHERE id=?";
    var params = [data.nombre, data.descripcion, data.id];
    return objDao.run(sql, params);
  }

  eliminar(data) {
    var sql = "DELETE FROM categoria WHERE id=?";
    var params = [data.id];
    return objDao.run(sql, params);
  }
}

module.exports = Model;
