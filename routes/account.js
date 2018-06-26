var express = require('express');
var router = express.Router();

router.get('/login', function(req, res, next) {
  res.render('account/index');
});

router.post('/login', function(req, res, next) {
  var db = req.db;
  var accountTable = db.get('account');
  accountTable.findOne({$and: [{username: req.body.username},
  {password: req.body.password}]}, {}, function(errors, account){
    if (account == null) {
      var data = {msg: 'Invalid account'};
      res.render('account/index', data);
    } else {
      req.session.username = req.body.username;
      res.redirect('/cart');
    }
  });
});

module.exports = router;
