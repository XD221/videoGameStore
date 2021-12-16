var passport = require('passport');
var user = require('./model/usuarioModel');
var passportLocal = require('passport-local').Strategy;
var md5 = require('md5');
// Controller
const controller = require('./controller/sessionController');

var compra = {};
var venta = {};

passport.use(new passportLocal( function(username, password, done){
  var resultado = controller.obtener(username, password, passport);
  resultado.then((data) => {
    if(data.length > 0){
      return done(null, {id: data[0].id_empleado + "." + md5(password), usuario: username, nombre: data[0].nombre + ' ' + data[0].paterno, url: data[0].url, compra: {}, venta: {} });
    }
    done(null, false);
  }).catch((err) => {
    done(null, false);
  });
}));
  
  passport.serializeUser((user, done) => {
    compra = user.compra;
    venta = user.venta;
    done(null, user.id);
  });
  
  passport.deserializeUser((userID, done) => {
    const id = userID.split('.');
    var resultado = controller.isLoggedIn(id[0]);
    resultado.then((data) => {
      if(data.length){
        if(md5(data[0].password) == id[1]){
          var resultado2 = controller.obtener(data[0].usuario, data[0].password);
          resultado2.then((data2) => {
            if(data2.length){
              return done(null, { id: data2[0].id_empleado + '.' +  md5(data[0].password), nombre: data2[0].nombre + ' ' + data2[0].paterno, usuario: data[0].usuario, url: data2[0].url, compra: compra, venta: venta });
            }else{
              return done(null, false);
            }
          }).catch((err) => {
            return done(err, false);
          });
        }
      }else{
        return done(null, false);
      }
    }).catch((err) => {
      return done(err, false);
    });
  });

  module.exports = passport;