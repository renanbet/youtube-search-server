var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
require('dotenv').config()

var routes = require('./routes/index')
var users = require('./modules/authentication/routes/users')
var schedule = require('./modules/youtube/routes/schedule')
var search = require('./modules/youtube/routes/search')
var video = require('./modules/youtube/routes/video')
var status = require('./modules/status/routes')

var app = express()

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type, Authorization'
  )
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  next()
})

// Configurações
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Path das Rotas da aplicação
app.use('/', status)
app.use('/status', status)
app.use('/auth', users)
app.use('/schedule', schedule)
app.use('/search', search)
app.use('/video', video)

// catch 404
app.use(function (req, res, next) {
  var err = {}
  err.message = 'Not found'
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  console.log(err)
  let status = err.status ? err.status : 500
  res.status(status).json({
    message: err.message ? err.message : 'Erro',
  })
})

module.exports = app
