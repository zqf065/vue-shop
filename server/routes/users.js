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
      res.cookie('userName', doc.userName, {
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
router.post('/logout', function (req, res, next) {
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
router.post('/checkLogin', function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: 0,
      msg: '',
      result: {
        userName: req.cookies.userName
      }
    });
  } else {
    res.json({
      status: 1,
      msg: ''
    });
  }
});
router.post('/getCarList', function (req, res, next) {
  var userId = req.cookies.userId
  User.findOne({userId: userId}, function(err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: 0,
          msg: '',
          result: {
            cartList: doc.cartList
          }
        })
      }
    }
  });
});
router.post('/cartDel', function (req, res, next) {
  var prodcutId = req.body.productId
  var userId = req.cookies.userId
  User.update({userId: userId}, {
    $pull: {
      'cartList': {
        'productId': prodcutId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      res.json({
        status: 0,
        msg: '删除成功'
      })
    }
  });
});
router.post('/cartEdit', function (req, res, next) {
  var productNum = req.body.productNum
  var productId = req.body.productId
  var userId = req.cookies.userId
  var checked = req.body.checked
  User.update({'userId': userId, 'cartList.productId': productId}, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, function (err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: 'success'
      })
    }
  })
});
router.post('/cartCheckAll', function (req, res, next) {
  var checkAll = req.body.checkAll;
  var userId = req.cookies.userId;
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: 0,
        msg: err.message
      });
    } else {
      doc.cartList.forEach(function (item) {
        item.checked = checkAll;
      });
      doc.save(function (err, doc2) {
        if (err) {
          res.json({
            status: 1,
            msg: err.message
          })
        } else {
          res.json({
            status: 0,
            msg: ''
          })
        }
      });
    }
  });
});
module.exports = router;
