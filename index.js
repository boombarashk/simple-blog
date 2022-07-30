const express  = require('express')
const path  = require('path')
const serverless = require('serverless-http');
const bodyParser = require('body-parser')
const indexRoutes = require('./routes/index')

const app = new express()

app.use(express.static(path.join(__dirname, 'public/scripts')))
app.use(express.static(path.join(__dirname, 'public/views')))
app.use(express.static(path.join(__dirname, 'doc')))


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/', indexRoutes)

module.exports = app;
module.exports.handler = serverless(app);
