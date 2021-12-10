const dao = require("./dao");
const objDao = new dao();

class Model {
  constructor() {}
  obtener(typeofData) {
    var sql;
    if(typeofData == 1){
      sql = "SELECT m.id, m.fecha, m.total, m.estado, p.nombre as proveedor , e.nombre as empleado FROM movimiento as m, proveedor as p, empleado as e WHERE id_tipoMovimiento = 1 AND m.id_proveedor = p.id AND m.id_empleado = e.id";
    }else if(typeofData == 2){
      sql = "SELECT m.id, m.fecha, m.total, m.estado, c.nombre as cliente, e.nombre as empleado FROM movimiento as m, empleado as e, cliente as c WHERE id_tipoMovimiento = 2 AND m.id_cliente = c.id AND m.id_empleado = e.id";
    }
    var params = [];
    return objDao.all(sql, params);
  }

  obtenerDetalle(data) {
    var sql = "SELECT p.urlIMG as url, p.nombre as nombre, d.cantidad as cantidad, d.precio as precio FROM detalleMovimiento as d, producto as p WHERE d.id_movimiento=? AND d.id_producto = p.id";
    var params = [ data.id ];
    return objDao.all(sql, params);
  }

  guardar(data, tipo) {
    if(tipo == 1){
      var sql =
        "INSERT INTO movimiento (fecha, total, estado, id_proveedor, id_cliente, id_empleado, id_tipoMovimiento) VALUES (?,?,0,?,0,?,1)";
      var params = [
        data.fecha,
        data.total,
        data.id_proveedor,
        data.id_empleado
      ];
      return objDao.run(sql, params);
    }else if(tipo == 2){
      var sql =
      "INSERT INTO movimiento (fecha, total, estado, id_proveedor, id_cliente, id_empleado, id_tipoMovimiento) VALUES (?,?,0,0,?,?,2)";
      var params = [
        data.fecha,
        data.total,
        data.id_cliente,
        data.id_empleado
      ];
      return objDao.run(sql, params);
    }
  }

  guardarDetalle(data) {
    var sql = "INSERT INTO detalleMovimiento (id_movimiento, id_producto, cantidad, precio) VALUES (?,?,?,?)";
    var params = [
      data.id_movimiento,
      data.id_producto,
      data.cantidad,
      data.precio
    ];
    return objDao.run(sql, params);
  }

  modificar(data) {
    var sql =
      "UPDATE movimiento SET fecha=?, total=?, id_proveedor=?, id_cliente=?, id_empleado=?, id_tipoMovimiento=? WHERE id=?";
    var params = [
      data.fecha,
      data.total,
      data.id_proveedor,
      data.id_cliente,
      data.id_empleado,
      data.id_tipoMovimiento,
      data.id,
    ];
    return objDao.run(sql, params);
  }

  eliminar(data) {
    var sql = "DELETE FROM movimiento WHERE id=?";
    var params = [data.id];
    return objDao.run(sql, params);
  }
}

module.exports = Model;
