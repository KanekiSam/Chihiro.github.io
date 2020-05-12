const { app } = require('../app.js');
const MongoClient = require('mongodb').MongoClient;
const dbUrl = 'mongodb://127.0.0.1:27017/mongos';
MongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, val) => {
  if (err) {
    console.log('数据库连接失败：', err);
  } else {
    console.log('数据库连接成功了');
  }
});
module.exports = { app, MongoClient, dbUrl };
require('./article.js');
require('./user.js');
