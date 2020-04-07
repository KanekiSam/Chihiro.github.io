var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
const {
  creatFile,
  deleteFile,
  getDirData,
  getOneFileData,
  editFileData,
} = require('./file');
// var multer = require('multer');
// var upload = multer();

var app = express();
// var router = express.Router();
var port = 5000;
const basePath = path.join(__dirname, 'file');
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/article/get/all', function(req, res) {
  var result = getDirData(basePath);
  res.status(result.status).send(result.data);
});
app.get('/article/get/one', (req, res) => {
  if (req.query && req.query.createTime) {
    var createTime = req.query.createTime;
    const result = getOneFileData(path.join(basePath, `${createTime}.txt`));
    res.status(result.status).send(result.data);
  }
  res.status(400).send('参数错误');
});
app.delete('/article/delete/one', (req, res) => {
  if (req.query && req.query.createTime) {
    var createTime = req.query.createTime;
    var result = deleteFile(path.join(basePath, `${createTime}.txt`));
    res.status(result.status).send(result.data);
  }
  res.status(400).send('参数错误');
});
app.put('/article/edit/one', (req, res) => {
  if (req.body && req.body.id) {
    var createTime = req.body.id;
    var result = editFileData(
      path.join(basePath, `${createTime}.txt`),
      req.body,
    );
    res.status(result.status).send(result.data);
  }
  res.status(400).send('参数错误');
});
app.post('/article/create', function(req, res) {
  if (req.body) {
    req.body.createTime = new Date().getTime();
    var pathway = path.join(basePath, `${req.body.createTime}.txt`);
    var result = creatFile(pathway, req.body);
    res.status(result.status).send(result.data);
  } else {
    res.status(500).send('参数错误');
  }
});
app.post('/article/register', function(req, res) {
  if (req.body) {
    const user = req.body.user;
    var pathway = path.join(__dirname, 'user/index.txt');
    const result = getOneFileData(pathway);
    if (result.status == 200) {
      var arr = JSON.parse(result.data) || [];
      const data = arr.find(item => item.user == user);
      if (data) {
        res.status(201).send('该用户已注册');
      }
      var result2 = creatFile(pathway, [...arr, req.body]);
      res.status(result2.status).send(result2.data);
    } else {
      res.status(result.status).send(result.data);
    }
  } else {
    res.status(500).send('参数错误');
  }
});
app.listen(port, function() {
  console.log('Server runninf at ' + port + ' port');
});
