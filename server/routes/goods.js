var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Good = require('./../models/goods.js');

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
router.get('/', function (req, res, next) {
  console.log(req.param);
  let pageSize = parseInt(req.param('pageSize'));
  pageSize = isNaN(pageSize) ? 8 : pageSize;
  let sort = req.param('sort');
  let pageIndex = parseInt(req.param('pageIndex'));
  let offset = (pageIndex - 1) * pageSize;
  let params = {};
  let goodsModel = Good.find(params).skip(offset).limit(pageSize);
  goodsModel.sort({'salePrice': sort});
  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err
      });
    } else {
      console.log(doc);
      res.json({
        status: '0',
        msg: '',
        result: doc
      });
    }
  });

});

module.exports = router;
