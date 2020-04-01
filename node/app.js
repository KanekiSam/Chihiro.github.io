var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
// var multer = require('multer');
// var upload = multer();

var app = express();
// var router = express.Router();
var port = 5000;
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/article/get/all', function(req, res) {
  var list = [];
  const data = fs.readdirSync(path.join(__dirname, 'file'));
  data.forEach((item, i) => {
    var data2 = fs.readFileSync(path.join(__dirname, 'file', item), 'utf8');
    list.push(JSON.parse(data2));
  });
  res.status(200).send(list);
});
app.post('/article/create', function(req, res) {
  if (req.body) {
    try {
      var pathway = path.join(__dirname, `file/${req.body.createTime}.txt`);
      fs.writeFile(pathway, JSON.stringify(req.body), err => {
        console.log(err);
      });
      res.status(200).send('success');
    } catch {
      res.status(400).send('出现错误');
    }
  } else {
    res.status(500).send('参数错误');
  }
});
app.listen(port, function() {
  console.log('Server runninf at ' + port + ' port');
});
