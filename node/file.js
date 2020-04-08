var fs = require('fs');
var path = require('path');

var result = { status: null, data: null };
var createFolder = function(to) {
  //文件写入
  var sep = path.sep;
  var folders = path.dirname(to).split(sep);
  var p = '';
  while (folders.length) {
    p += folders.shift() + sep;
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p);
    }
  }
};
module.exports = {
  checkFile: pathway => {
    var isexist = fs.existsSync(pathway);
    if (!isexist) {
      createFolder(pathway);
      fs.createWriteStream(pathway);
    }
  },
  creatFile: function(pathway, data) {
    try {
      fs.writeFileSync(pathway, JSON.stringify(data));
      result.status = 200;
      result.data = '写入成功!';
    } catch (err) {
      result.status = 500;
      result.data = err;
    }
    return result;
  },
  deleteFile: function(pathway) {
    try {
      fs.unlinkSync(pathway);
      result.status = 200;
      result.data = '删除成功';
    } catch (err) {
      result.status = 500;
      result.data = err;
    }
    return result;
  },
  getDirData: function(pathway) {
    try {
      var list = [];
      const data = fs.readdirSync(pathway);
      console.log(data);
      data.forEach((item, i) => {
        var data2 = fs.readFileSync(path.join(pathway, item), 'utf8');
        list.push(JSON.parse(data2));
      });
      result.status = 200;
      result.data = list;
    } catch (err) {
      result.status = 500;
      result.data = err;
    }
    return result;
  },
  getOneFileData: function(pathway) {
    try {
      const data = fs.readFileSync(pathway, 'utf8');
      result.status = 200;
      result.data = data;
    } catch (err) {
      result.status = 500;
      if (err.errno == -4058) {
        result.data = '找不到文件';
      } else {
        result.data = err;
      }
    }
    return result;
  },
  editFileData: function(pathway, data) {
    try {
      var data2 = fs.readFileSync(path.join(pathway), 'utf8');
      var data2 = JSON.parse(data2);
      Object.assign(data2, data);
      fs.writeFileSync(pathway, JSON.stringify(data2));
      result.status = 200;
      result.data = '修改成功';
    } catch (err) {
      result.status = 500;
      if (err.errno == -4058) {
        result.data = '找不到文件';
      } else {
        result.data = err;
      }
    }
    return result;
  },
};
