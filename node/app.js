var express = require('express');
var path = require('path');
// var fs = require('fs');
var bodyParser = require('body-parser');
// const {
//   creatFile,
//   deleteFile,
//   getDirData,
//   getOneFileData,
//   editFileData,
//   checkFile,
// } = require('./file');
// const { setCookie, getCookie, delCookie } = require('./cookie');
var cookieParser = require('cookie-parser');
// var multer = require('multer');
// var upload = multer();

var app = express();
// var router = express.Router();
var port = 5000;
// const basePath = path.join(__dirname, 'file');
// const userPath = path.join(__dirname, 'user/index.txt');
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
module.exports = { app };
require('./db/index.js');
app.listen(port, function() {
  console.log('Server runninf at ' + port + ' port');
});
