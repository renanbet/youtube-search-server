var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./modules/authentication/routes/users');
var schedule = require('./modules/youtube/routes/schedule');
var search = require('./modules/youtube/routes/search');
var video = require('./modules/youtube/routes/video');

var mongoose = require('mongoose');
let url = process.env.MONGO_URL || 'localhost:27017/youtube'
mongoose.connect(url);

var app = express();

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);
app.use('/auth', users);
app.use('/schedule', schedule);
app.use('/search', search);
app.use('/video', video);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = {}
  err.message = 'Not found';
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log(err)
  let status = err.status ? err.status : 500
  res.status(status)
  .json({
      message: err.message ? err.message : 'Erro'
    });
});

module.exports = app;
