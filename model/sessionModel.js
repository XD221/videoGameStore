const dao = require("./dao");
const objDao = new dao();

class Model {
    constructor() {}
    obtener(data) {
      var sql = `SELECT u.urlImg as url, u.id_empleado as id_empleado, e.nombre as nombre, e.apPaterno as paterno, e.apMaterno as materno FROM usuario as u, empleado as e WHERE u.id_empleado = e.id  AND usuario=? AND passwd=? LIMIT 1 `;
      var params = [data.user, data.password];
      return objDao.all(sql, params);
   
    }

    modificarpass(data) {
      var sql =
        "UPDATE usuario SET passwd=? WHERE id_empleado=?";
      var params = [
        data.passwd,
        data.id
      ];
      return objDao.run(sql, params);
    }

    isLoggedIn(data){
      var sql = "SELECT usuario , passwd as password FROM usuario WHERE id_empleado=? LIMIT 1";
      var params = [
        data.id
      ];
      return objDao.all(sql, params);
    }
}
  module.exports = Model;
  