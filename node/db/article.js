var { app, MongoClient, dbUrl } = require('./index.js');

const connectDb = (res, callback) => {
  MongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, db) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const article = db.db('admin').collection('article');
      if (!article) {
        db.db('admin').createCollection('article');
        article.distinct('id');
      }
      return callback(article, db);
    }
  });
};
app.get('/article/get/all', function(req, res) {
  connectDb(res, (article, db) => {
    article.find({}).toArray((err, docs) => {
      res.send(docs);
      res.end();
      db.close();
    });
  });
});
app.get('/article/get/one', (req, res) => {
  if (req.query && req.query.id) {
    connectDb(res, (article, db) => {
      article.find({ id: req.query.id }).toArray((err, docs) => {
        // console.log(docs)
        db.close();
        if (docs.length > 0) {
          res.send(docs[0]);
        } else {
          res.status(417).send('找不到文件');
        }
      });
    });
  } else {
    res.status(400).send('参数错误');
  }
});
app.delete('/article/delete/one', (req, res) => {
  if (req.query && req.query.id) {
    connectDb(res, (article, db) => {
      console.log(req.query.id);
      article.deleteOne({ id: req.query.id }, (err, result) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(result);
        }
        db.close();
      });
    });
  } else {
    res.status(400).send('参数错误');
  }
});
app.put('/article/edit/one', (req, res) => {
  if (req.body && req.body.id) {
    connectDb(res, (article, db) => {
      article.updateOne(
        { id: req.body.id },
        { $set: req.body },
        (err, result) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.send(result);
          }
        },
      );
    });
  } else {
    res.status(400).send('参数错误');
  }
});
app.post('/article/create', function(req, res) {
  if (req.body) {
    connectDb(res, (article, db) => {
      const gmt = new Date().getTime();
      Object.assign(req.body, { id: gmt.toString(), createTime: gmt });
      article.insertOne(req.body, (err, result) => {
        if (!err) {
          db.close();
          res.send('保存成功');
        }
      });
    });
  } else {
    res.status(400).send('参数错误');
  }
});
