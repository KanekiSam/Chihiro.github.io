var { app, MongoClient, dbUrl } = require('./index.js');
var { encodeCrypto, decodeCrypto } = require('../crypto.js');

const connectDb = (res, callback) => {
  MongoClient.connect(dbUrl, { useUnifiedTopology: true }, (err, db) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const admin = db.db('admin');
      const user = admin.collection('user');
      if (!user) {
        admin.createCollection('user', {
          validator: {
            $jsonSchema: {
              bsonType: 'object',
              required: ['user', 'password', 'questions'],
              properties: {
                user: {
                  bsonType: 'string',
                  description: 'user是字符串且必填',
                },
                password: {
                  bsonType: 'string',
                  description: 'password是字符串且必填',
                },
                questions: {
                  bsonType: 'object',
                  required: ['question', 'response'],
                  properties: {
                    question: {
                      bsonType: 'string',
                      description: 'question是字符串',
                    },
                    response: {
                      bsonType: 'string',
                      description: 'response是字符串',
                    },
                  },
                },
              },
            },
          },
        });
      }
      return callback(admin.collection('user'), db);
    }
  });
};
app.post('/user/register', function(req, res) {
  if (req.body) {
    const user = req.body.user;
    connectDb(res, (User, db) => {
      User.find({ user }).toArray((err, data) => {
        if (err) {
          res
            .status(500)
            .send(err)
            .end();
        } else {
          if (data.length > 0) {
            res
              .status(417)
              .send('该用户名已被使用了')
              .end();
          } else {
            console.log('register');
            User.insertOne(req.body, (err, data) => {
              if (err) {
                res
                  .status(500)
                  .send(err)
                  .end();
              } else {
                res
                  .status(200)
                  .send('注册成功')
                  .end();
              }
            });
          }
        }
      });
    });
  } else {
    res.status(400).send('参数错误');
  }
});
app.post('/user/login', function(req, res) {
  if (req.body) {
    var user = req.body.user;
    var password = req.body.password;
    connectDb(res, (User, db) => {
      User.find({ user }).toArray((err, data) => {
        if (err) {
          res
            .status(500)
            .send(err)
            .end();
        } else {
          if (data.length <= 0) {
            res
              .status(417)
              .send('登录失败，找不到该用户')
              .end();
          } else {
            const result = data[0];
            if (result.password !== password) {
              res
                .status(417)
                .send('登录失败，用户名或密码错误')
                .end();
            } else {
              const token = 'chihiro-' + new Date().getTime() + '-' + user;
              res
                .status(200)
                .send(encodeCrypto(token))
                .end();
            }
          }
        }
      });
    });
  } else {
    res.status(400).send('参数错误');
  }
});
app.get('/user/get/questions', function(req, res) {
  if (req.query && req.query.user) {
    var user = req.query.user;
    connectDb(res, (User, db) => {
      User.find({ user }).toArray((err, data) => {
        if (err) {
          res
            .status(500)
            .send(err)
            .end();
        } else {
          if (data.length <= 0) {
            res
              .status(417)
              .send('找不到该用户')
              .end();
          } else {
            const result = data[0];
            res
              .status(200)
              .send(
                result.questions.map(item => ({
                  question: item.question,
                  response: '',
                })),
              )
              .end();
          }
        }
      });
    });
  } else {
    res.status(400).send('参数错误');
  }
});
app.post('/user/check/questions', function(req, res) {
  if (req.body && req.body.user && req.body.questions) {
    var user = req.body.user;
    var questions = req.body.questions;
    connectDb(res, (User, db) => {
      User.find({ user }).toArray((err, data) => {
        if (err) {
          res
            .status(500)
            .send(err)
            .end();
        } else {
          if (data.length <= 0) {
            res
              .status(417)
              .send('找不到该用户')
              .end();
          } else {
            const result = data[0];
            for (var item of result.questions) {
              const qustionData = questions.find(
                list => list.question == item.question,
              );
              if (qustionData) {
                if (qustionData.response != item.response) {
                  return res
                    .status(417)
                    .send('问题回答错误')
                    .end();
                }
              } else {
                return res
                  .status(417)
                  .send('找不到该问题')
                  .end();
              }
            }
            return res
              .status(200)
              .send('问题回答正确')
              .end();
          }
        }
      });
    });
  } else {
    res
      .status(400)
      .send('参数错误')
      .end();
  }
});
app.get('/user/change/password', function(req, res) {
  if (req.query && req.query.user && req.query.password) {
    var user = req.query.user;
    connectDb(res, (User, db) => {
      User.find({ user }).toArray((err, data) => {
        if (err) {
          return res
            .status(500)
            .send(err)
            .end();
        } else {
          if (data.length <= 0) {
            return res
              .status(417)
              .send('找不到该用户')
              .end();
          } else {
            const result = data[0];
            if (result.password == req.query.password) {
              return res.status(202).send('不能设置相同密码');
            } else {
              User.updateOne(
                { user },
                { $set: { password: req.query.password } },
                (err, data) => {
                  if (err) {
                    return res
                      .status(500)
                      .send(err)
                      .end();
                  } else {
                    return res.status(200).send('密码更改成功，现在去登录吧');
                  }
                },
              );
            }
          }
        }
      });
    });
  } else {
    res.status(400).send('参数错误');
  }
});
app.get('/user/get/info', function(req, res) {
  try {
    const authrize = req.headers.authorization;
    if (authrize) {
      var auth = authrize.replace('Bearer ', '');
      var token = decodeCrypto(auth);
      token.split('-');
      var user = token[2];
      connectDb(res, (User, db) => {
        User.find(user).toArray((err, data) => {
          if (err) {
            return res
              .status(500)
              .send(err)
              .end();
          } else {
            if (data.length <= 0) {
              return res
                .status(417)
                .send('找不到该用户')
                .end();
            } else {
              var result = data[0];
              return res
                .status(200)
                .send({ user: result.user, id: result._id });
            }
          }
        });
      });
    } else {
      res.status(401).send('请先登录');
    }
  } catch (err) {
    console.log(err);
  }
});
