var express = require('express');
var router = express.Router();
var User = require('./../models/user.js');

/* GET users listing. */
router.post('/login', function (req, res, next) {
  User.findOne({userName: req.body.userName, userPwd: req.body.userPwd}, function (err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    }
    if (doc) {
      res.cookie('userId', doc.userId, {
        path: '/',
        maxAge: 1000 * 60 * 30
      });
      res.json({
        status: 0,
        msg: '',
        result: {
          userName: doc.userName
        }
      });
    } else {
      res.json({
        status: 1,
        msg: '用户名或密码错误',
        result: ''
      });
    }
  })
});
router.post('/loginOut', function(req, res, next) {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: 0,
    msg: 'success',
    result: ''
  });
});

module.exports = router;
