var express = require('express');
var router = express.Router();
var shops = require("../models/shop");
var qs = require('querystring');
var app = express();

const axios = require('axios')
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var cookieParser = require('cookie-parser');
var session = require('express-session');


var sess
app.use(express.json());

app.use(cookieParser());
app.use(session({secret: 'shhh', resave: false, saveUninitialized: false, cookie: { secure: !true }}));

app.use(router);



/* GET home page. */
router.get('/', function(req, res, next) {
sess = req.session;
console.log(req.session)
if(req.session.acc){
var shop = new shops()
    shops.find({}, function(err, result) {
        if (err) {
          res.send(err);
        } else {
         console.log('ok')
         res.render('index', { title: 'Express','shops':result });
        }
    });}
else{
    res.send("Please loging first.")
}
  console.log(shop)
  
});


router.get('/shop', function(req, res, next) {
    shops.find({}, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
  });
});
router.post('/shop', function(req, res, next) {
    var shop = new shops();

    shop.shopname = req.body.shopname;
    shop.address = req.body.address;
    shop.phone = req.body.phone;
    shop.owner = req.body.owner;

    shop.save(shop)
    res.send(shop);
});
router.get('/shop/:shopname', function(req, res, next) {
    shops.findOne({shopname:req.params.shopname}, function(err, result) {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
  });
});
router.put('/shop/:shopname', function(req, res, next) {
    shops.findOneAndUpdate({shopname:req.params.shopname}, req.body, { new: true }, function(err, result) {
    console.log(req.body)        
        if (err)
            res.send(err);
        res.json(result);
    });
});
router.delete('/shop/:shopname', function(req, res, next) {
    console.log(req.params.shopname)
    shops.findOneAndRemove({shopname:req.params.shopname},  function(err, result) {
        if (err)
            res.send(err);
        res.json(result);
    });
});

router.get('/shopc', function(req, res, next) {
    res.render('shop_form', { title: 'Create shop'});
});
router.post('/shopc',function(req, res, next) {     
var shop = new shops(
    {
        shopname: req.body.shopname,
        address: req.body.address,
        phone: req.body.phone,
        owner: req.body.owner
    });
    shop.save(function (err) {
        if (err) { return next(err); }
        // Successful - redirect to new author record.
        res.redirect("/");
            });
});

//驗證line login
router.get('/auth', function(req, res) {
const config = { 
    headers:{'Content-Type' : 'application/x-www-form-urlencoded'
    }
}
const data = {
        'grant_type':'authorization_code',
        'code': req.query.code,
        'redirect_uri': 'https://fe4097bed9f0.ngrok.io/auth',
        'client_id': '1655219908',
        'client_secret': '06d945dfe7ad9c1ea3c6525357396113'
}
    axios.post('https://api.line.me/oauth2/v2.1/token',qs.stringify(data),config)
    .then(function (response) {
        sess = req.session;
        req.session.acc = response.data.access_token
        shops.find({}, function(err, result) {
        if (err) {
          res.send(err);
        } else {
         console.log('ok')
         res.render('index', { title:'express','shops':result,'acc': response.data.access_token });
        }
    });

  })  
    .catch(function (error) {
        console.log(error);
        res.send(error);
  });
 
    //res.redirect("http://localhost:8080/#/");
    console.log(req.query.code);
});
module.exports = router;
