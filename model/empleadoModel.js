const dao = require("./dao");
const objDao = new dao();

class Model {
  constructor() {}
  obtener() {
    var sql = "SELECT * FROM empleado";
    var params = [];
    return objDao.all(sql, params);
  }

  guardar(data) {
    var sql =
      "INSERT INTO empleado (ci, nombre, apPaterno, apMaterno, telefono, direccion, estado) VALUES (?,?,?,?,?,?,0)";
    var params = [
      data.ci,
      data.nombre,
      data.apPaterno,
      data.apMaterno,
      data.telefono,
      data.direccion,
      data.estado,
    ];
    return objDao.run(sql, params);
  }

  modificar(data) {
    var sql =
      "UPDATE empleado SET ci=?, nombre=?, apPaterno=?, apMaterno=?, telefono=?, direccion=? WHERE id=?";
    var params = [
      data.ci,
      data.nombre,
      data.apPaterno,
      data.apMaterno,
      data.telefono,
      data.direccion,
      data.id,
    ];
    return objDao.run(sql, params);
  }

  eliminar(data) {
    var sql = "DELETE FROM empleado WHERE id=?";
    var params = [data.id];
    return objDao.run(sql, params);
  }
}

module.exports = Model;
