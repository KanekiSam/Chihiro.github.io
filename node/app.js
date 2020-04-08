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
  checkFile,
} = require('./file');
// const { setCookie, getCookie, delCookie } = require('./cookie');
var cookieParser = require('cookie-parser');
// var multer = require('multer');
// var upload = multer();

var app = express();
// var router = express.Router();
var port = 5000;
const basePath = path.join(__dirname, 'file');
const userPath = path.join(__dirname, 'user/index.txt');
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/article/get/all', function(req, res) {
  var result = getDirData(basePath);
  res.status(result.status).send(result.data);
});
app.get('/article/get/one', (req, res) => {
  if (req.query && req.query.createTime) {
    var createTime = req.query.createTime;
    const result = getOneFileData(path.join(basePath, `${createTime}.txt`));
    return res.status(result.status).send(result.data);
  }
  res.status(400).send('参数错误');
});
app.delete('/article/delete/one', (req, res) => {
  if (req.query && req.query.createTime) {
    var createTime = req.query.createTime;
    var result = deleteFile(path.join(basePath, `${createTime}.txt`));
    return res.status(result.status).send(result.data);
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
    return res.status(result.status).send(result.data);
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
    res.status(400).send('参数错误');
  }
});
app.post('/article/register', function(req, res) {
  if (req.body) {
    const user = req.body.user;
    checkFile(userPath);
    const result = getOneFileData(userPath);
    if (result.status == 200) {
      var arr = result.data ? JSON.parse(result.data) : [];
      const data = arr.find(item => item.user == user);
      if (data) {
        return res.status(202).send('该用户已注册');
      }
      delete req.body.rePassword;
      req.body.id = new Date().getTime();
      var result2 = creatFile(userPath, [...arr, req.body]);
      res.status(result2.status).send(result2.data);
    } else {
      res.status(result.status).send(result.data);
    }
  } else {
    res.status(400).send('参数错误');
  }
});
app.post('/article/login', function(req, res) {
  if (req.body) {
    var user = req.body.user;
    var password = req.body.password;
    checkFile(userPath);
    var result = getOneFileData(userPath);
    if (result.status == 200) {
      var arr = result.data ? JSON.parse(result.data) : [];
      const data = arr.find(item => item.user == user);
      if (data) {
        if (data.password != password) {
          return res.status(202).send('用户名或密码错误');
        }
        return res
          .status(200)
          .cookie('userToken', data.id, {
            maxAge: 1000 * 3600 * 24 * 7,
            path: '/article/get/user',
          })
          .send('登录成功');
      }
      return res.status(202).send('找不到该用户');
    }
    return res.status(result.status).send(result.data);
  }
  res.status(400).send('参数错误');
});
app.get('/article/get/questions', function(req, res) {
  if (req.query && req.query.user) {
    var user = req.query.user;
    var result = getOneFileData(userPath);
    if (result.status == 200) {
      var arr = result.data ? JSON.parse(result.data) : [];
      const data = arr.find(item => item.user == user);
      if (data) {
        return res.status(200).send(
          data.questions.map(item => ({
            question: item.question,
            response: '',
          })),
        );
      }
      return res.status(202).send('找不到该用户');
    }
  }
  res.status(400).send('参数错误');
});
app.post('/article/check/questions', function(req, res) {
  if (req.body && req.body.user && req.body.questions) {
    var user = req.body.user;
    var questions = req.body.questions;
    var result = getOneFileData(userPath);
    if (result.status == 200) {
      var arr = result.data ? JSON.parse(result.data) : [];
      const userData = arr.find(item => item.user == user);
      if (userData) {
        for (var item of userData.questions) {
          const qustionData = questions.find(
            list => list.question == item.question,
          );
          if (qustionData) {
            if (qustionData.response != item.response) {
              return res.status(202).send('问题回答错误');
            }
          } else {
            return res.status(202).send('找不到该问题');
          }
        }
        return res.status(200).send('问题回答正确');
      }
      return res.status(202).send('找不到该用户');
    }
  }
  res.status(400).send('参数错误');
});
app.get('/article/change/password', function(req, res) {
  if (req.query && req.query.user && req.query.password) {
    var user = req.query.user;
    var result = getOneFileData(userPath);
    if (result.status == 200) {
      var arr = result.data ? JSON.parse(result.data) : [];
      const index = arr.findIndex(item => item.user == user);
      if (index > -1) {
        if (arr[index].password == req.query.password) {
          return res.status(202).send('不能设置相同密码');
        }
        arr[index].password = req.query.password;
        var result2 = editFileData(userPath, arr);
        if (result2.status == 200) {
          return res.status(200).send('修改成功');
        }
        return res.status(result2.status).send(result2.data);
      }
      return res.status(202).send('找不到该用户');
    }
  }
  res.status(400).send('参数错误');
});
app.get('/article/get/user', function(req, res) {
  console.log(req.cookie);
});
app.listen(port, function() {
  console.log('Server runninf at ' + port + ' port');
});
