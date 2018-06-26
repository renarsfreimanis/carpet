var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

/* GET home page. */
router.get('/buy/:id', function(req, res, next) {
  var db = req.db;
  var productTable = db.get('product');
  productTable.findOne({_id: new mongodb.ObjectID
    (req.params.id) }, {}, function(errors, product){
      if(req.session.cart == null) {
        req.session.cart = [
          {product: product, quantity: 1}
        ];
      }else {
        var index = -1;
        for (var i = 0; i < req.session.cart.length; i++) {
          if(req.session.cart[i].product._id == req.params.id){
            index = i;
            break;
          }
        }
        if (index == -1) {
          req.session.cart.push({
            product: product, quantity: 1
          });
        }else {
          req.session.cart[index].quantity++;
        }
      }
      res.render('cart/index');
  });
});

router.get('/', function(req, res, next) {
  res.render('cart/index');
});

router.get('/delete/:index', function(req, res, next) {
  var index = parseInt(req.params.index);
  req.session.cart.splice(index, 1);
  res.redirect('/cart');
});

router.get('/checkout', function(req, res, next) {
  if (req.session.username == null) {
    res.redirect('/account/login');
  } else {
    var db = req.db;
    var ordersTable = db.get('orders');
    var ordersDetailTable = db.get('ordersDetail');
    // add new order
    var order = {
      name: 'Order Online',
      date: new Date().toLocaleDateString(),
      username: req.session.username,
      payment: 'payment 1',
      status: false,
    };
    ordersTable.insert(order, function(errors, result){
      // add order detail
      var orderDetails = [];
      for (var i = 0; i < req.session.cart.length; i++) {
        var orderDetail = {
          orderId: order._id,
          productId: req.session.cart[i].product._id,
          price: req.session.cart[i].product.price,
          quantity: req.session.cart[i].quantity
        };
        orderDetails.push(orderDetail);
      }
      ordersDetailTable.insert(orderDetail, function(errors, result) {
        res.render('cart/thanks');
      });
    });
  }
});

module.exports = router;
