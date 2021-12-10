const dao = require("./dao");
const objDao = new dao();

class Model {
  constructor() {}
  obtener() {
    var sql =
      "SELECT p.id as id, p.nombre as nombre, p.urlIMG as urlIMG, p.precio as precio, p.cantidad as cantidad, p.id_marca as id_marca, p.id_categoria as id_categoria, m.nombre as marca, c.nombre as categoria FROM producto as p, marca as m, categoria as c WHERE p.id_categoria = c.id AND p.id_marca = m.id";
    var params = [];
    return objDao.all(sql, params);
  }

  obtenerCompra() {
    var sql =
      "SELECT p.*, c.nombre as categoria, m.nombre as marca FROM producto as p, marca as m, categoria as c WHERE p.id_categoria = c.id AND p.id_marca = m.id";
    var params = [];
    return objDao.all(sql, params);
  }

  obtenerReal() {
    var sql =
      "SELECT p.*, c.nombre as categoria, m.nombre as marca FROM producto as p, marca as m, categoria as c WHERE cantidad > 0 AND p.id_categoria = c.id AND p.id_marca = m.id";
    var params = [];
    return objDao.all(sql, params);
  }

  guardar(data) {
    var sql =
      "INSERT INTO producto (nombre, urlIMG, precio, cantidad, id_categoria, id_marca) VALUES (?,?,?,?,?,?)";
    var params = [
      data.nombre,
      data.urlIMG,
      data.precio,
      data.cantidad,
      data.id_categoria,
      data.id_marca,
    ];
    return objDao.run(sql, params);
  }

  incrementar(data) {
    var sql = "UPDATE producto SET cantidad= cantidad + ? WHERE id=?";
    var params = [data.cantidad, data.id];
    return objDao.run(sql, params);
  }

  decrementar(data) {
    var sql = "UPDATE producto SET cantidad= cantidad - ? WHERE id=?";
    var params = [data.cantidad, data.id];
    return objDao.run(sql, params);
  }

  modificar(data) {
    var sql =
      "UPDATE producto SET nombre=?, urlIMG=?, precio=?, cantidad=?, id_categoria=?, id_marca=? WHERE id=?";
    var params = [
      data.nombre,
      data.urlIMG,
      data.precio,
      data.cantidad,
      data.id_categoria,
      data.id_marca,
      data.id,
    ];
    return objDao.run(sql, params);
  }

  eliminar(data) {
    var sql = "DELETE FROM producto WHERE id=?";
    var params = [data.id];
    return objDao.run(sql, params);
  }
}

module.exports = Model;
