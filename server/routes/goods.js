var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Good = require('./../models/goods.js');
var user = require('./../models/user.js');

mongoose.connect('mongodb://127.0.0.1:27017/vue_shop');
mongoose.connection.on('connected', function () {
  console.log('MongDB connected success.');
});
mongoose.connect('error', function () {
  console.log('MongDB connected fail.')
});
mongoose.connect('disconnected', function () {
  console.log('MongDB disconnected.')
});
/* GET home page. */
router.get('/list', function (req, res, next) {
  let pageSize = parseInt(req.param('pageSize'));
  pageSize = isNaN(pageSize) ? 8 : pageSize;
  let sort = req.param('sort');
  let pageIndex = parseInt(req.param('pageIndex'));
  let offset = (pageIndex - 1) * pageSize;
  let startPrice = parseInt(req.param('startPrice'));
  let endPrice = parseInt(req.param('endPrice'));
  let params = {};
  if (endPrice !== 0) {
    params.salePrice = {
      $gt: startPrice,
      $lte: endPrice
    }
  }
  let goodsModel = Good.find(params).skip(offset).limit(pageSize);
  goodsModel.sort({'salePrice': sort});
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err
      });
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc
      });
    }
  });
});
router.post('/addCart', function(req, res, next) {
  var userId = '100000077';
  var productId = req.body.productId;
  user.findOne({'userId': userId}, (err, doc) => {
    if (err) {
      res.json({
        'status': 0,
        'msg': 'success'
      });
    } else {
      var productItem;
      doc.cartList.forEach(function (item) {
        if (item.productId === productId) {
          item.productNum ++;
          productItem = item;
        }
      });
      if (productItem) {
        doc.save(function (err, doc2) {
          if (err) {
            res.json({
              'status': 1,
              'msg': err
            });
          } else {
            res.json({
              'status': 0,
              'msg': 'success'
            });
          }
        });
      } else {
        Good.findOne({'productId': productId}, function (err, doc3) {
          if (err) {
            res.json({
              'status': 1,
              'msg': err
            });
          } else {
            productItem = doc3;
            productItem.productNum = 1;
            productItem.checked = 1;
            doc.cartList.push(productItem);
            doc.save(function (err, doc4) {
              if (err) {
                res.json({
                  'status': 1,
                  'msg': err
                });
              } else {
                res.json({
                  'status': 0,
                  'msg': 'success'
                });
              }
            });
          }
        });
      }
    }
  });
});
module.exports = router;
