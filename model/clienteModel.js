const dao = require("./dao");
const objDao = new dao();

class Model {
  constructor() {}
  obtener() {
    var sql = "SELECT * FROM cliente WHERE id > 1";
    var params = [];
    return objDao.all(sql, params);
  }

  obtenerConAnonimo() {
    var sql = "SELECT * FROM cliente WHERE id > 0";
    var params = [];
    return objDao.all(sql, params);
  }

  guardar(data) {
    var sql =
      "INSERT INTO cliente (ci, nombre, apPaterno, apMaterno, telefono) VALUES (?,?,?,?,?)";
    var params = [
      data.ci,
      data.nombre,
      data.apPaterno,
      data.apMaterno,
      data.telefono,
    ];
    return objDao.run(sql, params);
  }

  modificar(data) {
    var sql =
      "UPDATE cliente SET ci=?, nombre=?, apPaterno=?, apMaterno=?, telefono=? WHERE id=?";
    var params = [
      data.ci,
      data.nombre,
      data.apPaterno,
      data.apMaterno,
      data.telefono,
      data.id,
    ];
    return objDao.run(sql, params);
  }

  eliminar(data) {
    var sql = "DELETE FROM cliente WHERE id=?";
    var params = [data.id];
    return objDao.run(sql, params);
  }
}

module.exports = Model;
