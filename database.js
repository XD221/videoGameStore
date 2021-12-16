var sqlite3 = require('sqlite3').verbose();
var dbSource = "./DB/dbGame.SQLITE";

let db = new sqlite3.Database(dbSource, (err) => {
    if (err) {
        console.log(err.message);
        throw err;
    } else {
        console.log('Conectado a la Base de Datos SQLite');   
    }
});

module.exports = db;