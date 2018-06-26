var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var productTable = db.get('product');
  productTable.find({}, {}, function(errors, products){
    var data = {products: products};
    res.render('product/index', data);
  });
});

module.exports = router;
