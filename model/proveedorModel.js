const dao = require("./dao");
const objDao = new dao();

class Model {
  constructor() {}
  obtener() {
    var sql = "SELECT * FROM proveedor WHERE id > 0";
    var params = [];
    return objDao.all(sql, params);
  }

  obtenerDisponible() {
    var sql = "SELECT * FROM proveedor WHERE id > 0 AND estado = 0";
    var params = [];
    return objDao.all(sql, params);
  }

  guardar(data) {
    var sql =
      "INSERT INTO proveedor (nombre, direccion, telefono, estado) VALUES (?,?,?, 0)";
    var params = [data.nombre, data.direccion, data.telefono];
    return objDao.run(sql, params);
  }

  modificar(data) {
    var sql =
      "UPDATE proveedor SET nombre=?, direccion=?, telefono=?, estado=? WHERE id=?";
    var params = [
      data.nombre,
      data.direccion,
      data.telefono,
      data.estado,
      data.id,
    ];
    return objDao.run(sql, params);
  }

  eliminar(data) {
    var sql = "DELETE FROM proveedor WHERE id=?";
    var params = [data.id];
    return objDao.run(sql, params);
  }
}

module.exports = Model;
