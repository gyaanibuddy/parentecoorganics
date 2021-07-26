'use strict';
//save user api
const express = require("express");
let users = require('../models/user');
let orders = require('../models/order');
let ensureAuthenticated = require('./auth');
let jwt = require('jwt-simple');
let config = require('../config');
let moment = require('moment');
let app = express();
let passport = require("passport");
let LocalStrategy = require("passport-local");
let passportLocalMongoose =  require("passport-local-mongoose");


app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
 
passport.use(new LocalStrategy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());

//const { roles } = require('../roles');
/*
|--------------------------------------------------------------------------
| Generate JSON Web Token
|--------------------------------------------------------------------------
*/
let createJWT = function (user) {
  let payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

var handleError = function(error) {
    console.log(error);
    return false ;
};

app.get('/register',function(req, res) {
  res.render('register',{success:'true'});
});

app.get('/login',function(req, res) {
  res.render('login',{success:'true'});
});

app.get('/productdetail',function(req, res) {
  res.render('product_detail',{success:'true'});
});

app.get('/about',function(req, res) {
  res.render('about',{success:'true'});
});

app.get('/contact',function(req, res) {
  res.render('contact',{success:'true'});
});

/*
app.post('/register', /*ensureAuthenticated, function(req, res) {
    //Checking if username is already present in system
    users.findOne({ email: req.body.email }, '+password -documents')
      .exec(function (err,user){
        if (!user){ /// This means user is not present need to save it
           var lastRecId = 1;
           let user = new users({
              email: req.body.email,
              username : req.body. username,
              firstName: req.body.firstname,
              lastName: req.body.lastname,
              username : req.body.username,
              primaryAddress: {
                    addr1: req.body.addr1,
                    addr2: req.body.addr2,
                    city: req.body.city,
                    state: req.body.state,
                    postalCode: req.body.postalCode,
              } ,
              contactNo: req.body.contactNo,
              password: req.body.password,
          });
          user.save(req.body.password,function(err, result) {
            if (err) {
              res.status(500).send({success:false, message: err.message });
              res.end();
            }else{
              if(result != undefined){
                res.redirect('/');
               // res.jsonp({ success:true,data:result,token: createJWT(result) });
                res.end();
              }else{
                res.jsonp({ success:false, message:'Unable to save data' });
                res.end();
              }
            }
          });


        }else{
          res.jsonp({
            success: false,
            message: "User name already exists."
          });
          res.end();
        }
      });


});

*/

app.post("/register", function(req, res){
    let user = new users({
              //email: req.body.email,
              username : req.body.username,
              firstName: req.body.firstname,
              lastName: req.body.lastname,
             // username : req.body.username,
              primaryAddress: {
                    addr1: req.body.addr1,
                    addr2: req.body.addr2,
                    city: req.body.city,
                    state: req.body.state,
                    postalCode: req.body.postalCode,
              } ,
              contactNo: req.body.contactNo,
              password : req.body.password
          });
   
    users.register(user, req.body.password, function(err, user){
        if (err){
            console.log(err)
            //req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate('local')(req, res, function(){
          //  req.flash("success", "Εγινε συνδεση του/της " + user.username);
            res.redirect('/products');
        });
    });
});
app.post("/login",passport.authenticate("local",
{
    successRedirect:"/",
    failureRedirect: "/login"
}), function(req, res){
});


app.post("/cart/:id", async (req, res) => {
  const  productId = req.params.id;
  const quantity  = req.body.quantity;

  const owner = req.body.owner; //TODO: the logged in user id

  try {
    let cart = await orders.findOne({ owner });

    if (cart) {
      //cart exists for user
      let itemIndex = cart.products.findIndex(p => p.productId == productId);

      if (itemIndex > -1) {
        //product exists in the cart, update the quantity
        let productItem = cart.products[itemIndex];
        productItem.quantity = quantity;
        cart.products[itemIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        cart.products.push({ productId, quantity });
      }
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      //no cart for user, create new cart
      const newCart = await orders.create({
        owner,
        products: [{ productId, quantity}]
      });

      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});



app.get('/getCart/:id', /*ensureAuthenticated*/ function(req, res) {
  orders.find({owner:req.params.id})
  
  .populate('owner')
  .populate('products.productId')
  .exec(function(err,result){
    if(err){
      res.jsonp({ success:false,data:err});
      res.end();
    }
    if(result){
      res.jsonp({ success:true,data:result});
      res.end();
    }else{
      //This means data not found
      res.jsonp({ success:false,msg:'No records available'});
      res.end();
    }
  });
});




app.get('/api/getUsers', function(req, res) {
       users.find({}, function(err,result){
             if(err){
               res.jsonp({ success:false,data:err});
               res.end();
             }
             if(result){
               res.jsonp({ success:true,data:result});
               res.end();

             }else{
               //This means data not found
               res.jsonp({ success:false,data:'data not found'});
               res.end();
             }
         })
      // res.jsonp({
      //   success: true,
      //   message: ['saved']
      // });
      // res.end();
});
module.exports = app ;
