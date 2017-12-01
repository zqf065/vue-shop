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
router.post('/addressList', function (req, res, next) {
  let userId = req.cookies.userId
  console.log('userid=======' + userId);
  User.findOne({userId: userId}, function (err, user) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    }
    if (user) {
      res.json({
        status: 0,
        msg: '',
        result: user.addressList
      })
    }
  })
});
router.post('/addressDel', function (req, res, next) {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    }
    if (doc && doc.addressList.length === 1) {
      res.json({
        status: 1,
        msg: '收货地址至少保留一条'
      })
    }
  });
  User.update({userId: userId}, {
    $pull: {
      addressList: {
        'addressId': addressId
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
        msg: ''
      })
    }
  });
});
router.post('/addressAdd', function (req, res, next) {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  let userName = req.body.userName;
  let streetName = req.body.streetName;
  let postCode = req.body.postCode;
  let tel = req.body.tel;
  let isDefault = req.body.isDefault;
  User.findOne({userId: userId}, function (err, user) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    }
    if (user) {
      if (isDefault) {
        user.addressList.forEach(function (item) {
          item.isDefault = false
        });
      }
      user.addressList.push({
        'addressId': addressId,
        'userName': userName,
        'streetName': streetName,
        'postCode': postCode,
        'tel': tel,
        'isDefault': isDefault
      });
      user.save(function (err, doc) {
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
router.post('/addressEdit', function (req, res, next) {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  User.findOne({userId: userId}, function (err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    }
    if (doc) {
      doc.addressList.forEach(function (item) {
        item.isDefault = item.addressId === addressId;
      });
      doc.save(function (err, doc) {
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
  })
});
router.post('/subOrder', function (req, res, next) {
  let addressInfo, orderId;
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  let subTotal = req.body.subTotal;
  var goodListInfo = [];
  User.findOne({userId: userId}, function (err, user) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    }
    if (user) {
      user.addressList.forEach((item) => {
        if (item.addressId === addressId) {
          addressInfo = item
        }
      });
      user.cartList.forEach((item) => {
        if (item.checked === '1') {
          goodListInfo.push(item)
        }
      });
      orderId = Math.round(Math.random() * 1000000);
      user.orderList.push({
        orderId: orderId,
        addressInfo: addressInfo,
        goodListInfo: goodListInfo,
        subTotal: subTotal
      });
      user.save(function (err, doc) {
        if (err) {
          res.json({
            status: 1,
            msg: err.message
          })
        } else {
          res.json({
            status: 0,
            msg: '',
            result: orderId
          })
        }
      });
    }
  })
});
router.post('/orderDetail', function (req, res, next) {
  var subTotal;
  let userId = req.cookies.userId;
  let orderId = req.body.orderId;
  User.findOne({userId: userId}, function (err, user) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message
      })
    }
    if (user) {
      user.orderList.forEach((item) => {
        if (item.orderId === orderId) {
          subTotal = item.subTotal
        }
      });
      res.json({
        status: 0,
        msg: '',
        result: {
          subTotal: subTotal,
          orderId: orderId
        }
      })
    }
  })
});
module.exports = router;
