const promise = require("bluebird");
const db = require("../database.js");

class dao {
  constructor() {}
  run(sql, params = []) {
    return new promise((resolve, reject) => {
      db.run(sql, params, function (err, result) {
        if (err) {
          console.log("Error en sql : " + sql);
          console.log(err);
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
    });
  }
  all(sql, params = []) {
    return new promise((resolve, reject) => {
      db.all(sql, params, function (err, rows) {
        if (err) {
          console.log("Error en sql : " + sql);
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = dao;
