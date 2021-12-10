var md5 = require('md5');

const classModel = require("../model/sessionModel");
const model = new classModel();

function antiInjections(data){
    //data = data.replace('--', '');
    //data = data.replace("'", '');
    //data = data.replace('"', '');
    //data = data.replace('=', '');
    //data = data.replace(' and ', '');
    //data = data.replace(' or ', '');
    return data;
}

module.exports = {
  
    obtener: function (username, password) {
      var data = {
        user: antiInjections(username),
        password: antiInjections(password)
      };
      return model.obtener(data);
    },

    isLoggedIn: function(id) {
      var data = {
        id: id
      };

      return model.isLoggedIn(data);
    }
  };