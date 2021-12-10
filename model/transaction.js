const { Sequelize, sequelize } = require('sequelize');
const promise = require("bluebird");

const t = new Sequelize({
    dialect: 'sqlite',
    dialectOptions: {connectTimeout: 1000},
    storage: ".\\DB\\dbGame.db",
    autocommit: false
});

const existTransaction = () => {
    return new promise((resolve, reject) => {
        t.authenticate().then(() => {
            console.info('Established connection');
            resolve( true );
        }).catch((err) => {
            console.error('Error connection: ' + err);
            reject( err );
        });
    });
}

const transaction = async () => {return await t.transaction()};

const queryTransaction = (sql, params, tt, type) => {
    var queryType;
    if(type == 0){
        queryType = t.QueryTypes.INSERT;
    }else if(type == 1){
        queryType = t.QueryTypes.UPDATE;
    }
    var stack = [];
    for(x = params.length - 1; x >= 0 ; x--) {
        params[x] = params[x].toString().toLowerCase().replace('--', '');
        params[x] = params[x].toString().toLowerCase().replace('//', '');
        params[x] = params[x].toString().toLowerCase().replace("'", '');
        params[x] = params[x].toString().toLowerCase().replace('"', '');
        params[x] = params[x].toString().toLowerCase().replace(' AND ', '');
        params[x] = params[x].toString().toLowerCase().replace(' OR ', '');
        stack.push(params[x]);
    }
    var sql = sql.split('');
    for(x = 0; x < sql.length; x++) {
        if(sql[x] == '?'){
            var text = stack.pop();
            sql[x] = sql[x].replace('?', text);
        }
    }
    sql = sql.join('');
    return new promise((resolve, reject) => {
        t.query(sql, { type: queryType ,transaction: tt }).then((results) => {
            resolve(results);
        }).catch((err) => {
            reject(err);
        });
    });
}


module.exports = {
    existTransaction,
    queryTransaction,
    transaction
};