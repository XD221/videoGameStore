var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var sessionRoute = require('./routes/sessionRoute');
var clienteRoute = require('./routes/clienteRoute');
var empleadoRoute = require('./routes/empleadoRoute');
var categoriaRoute = require('./routes/categoriaRoute');
var marcaRoute = require('./routes/marcaRoute');
var productoRoute = require('./routes/productoRoute');
var proveedorRoute = require('./routes/proveedorRoute');
var movimientoRoute = require('./routes/moviemientoRoute');
var configuracionRoute = require('./routes/configuracionRoute');

var app = express();

//const variable
const expiresTime = 600000;

// view engine setup
app.set('trust proxy', 1);
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views\\pages')]);
app.set('view engine', 'pug');

app.use(session({
  rolling: true,
  cookie: {
    maxAge : expiresTime,//180000,
  },
  secret: 'videoGameStore@secret.com',
  resave: true,
  saveUninitialized: false
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('videoGameStore@secret.com'));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '/public')));

//Function
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    if(res.locals.fecha === undefined){
      var today = new Date();
      var date = today.getDate() + '/' + (today.getMonth() + 1) + '/'+ today.getFullYear();
      res.locals.fecha = date;
    }
    res.locals.cuenta = req.user.usuario;
    res.locals.usuario = req.user.nombre;
    res.locals.url = req.user.url;
    return next();
  }
  res.redirect("/login");
}


//Route
app.use('/login', (req, res, next) => {
  if (req.isAuthenticated()){
    res.redirect("/");
  }else{
    return next();
  }
}, sessionRoute);
app.use('/cliente', isLoggedIn, clienteRoute);
app.use('/empleado', isLoggedIn, empleadoRoute);
app.use('/categoria', isLoggedIn, categoriaRoute);
app.use('/producto', isLoggedIn, productoRoute);
app.use('/marca', isLoggedIn, marcaRoute);
app.use('/compra', isLoggedIn, movimientoRoute);
app.use('/venta',  isLoggedIn,movimientoRoute);
app.use('/proveedor', isLoggedIn, proveedorRoute);
app.use('/', isLoggedIn, indexRouter);
app.use('/configuracion',configuracionRoute);
app.use('/logout', (req, res) => {
  console.info(`Cuenta  '${res.locals.cuenta}' Cerrada...`);
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }

    // destroy session data
    req.session = null;
	});
  req.logout();
  res.redirect('/login');
});

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  next(createError(404));
//});

// error handler
//app.use(function(err, req, res, next) {
  // set locals, only providing error in development
//  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};

//  // render the error page
//  res.status(err.status || 500);
//  res.render('error');
//});

module.exports = app;
