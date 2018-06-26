var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

// Connect database
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/mydemo');

var product = require('./routes/product');
var cart = require('./routes/cart');
var account = require('./routes/account');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({resave: true, saveUninitialized: true,
secret: 'octopuscodes', cookie: { maxAge: 60000 }}));
app.use(express.static(path.join(__dirname, 'public')));

// Make your db accessibl to our router
app.use(function(req, res, next){
  req.db = db;
  res.locals.session = req.session;
  next();
});

app.use('/', product);
app.use('/product', product);
app.use('/cart', cart);
app.use('/account', account);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.listen(5000, 'localhost');
