'use strict';
//save user api
const express = require("express");

let users = require('./models/user');
let product = require('./models/product');
let orders = require('./models/order');
let coupons = require('./models/coupon');
let review = require('./models/review');

let jwt = require('jwt-simple');
let config = require('../config');
let moment = require('moment');
let app = express();
let ensureAuthenticated = require('./auth');

app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));
// const id = 'ACa49610952b3cdf4c1164a457ca9e6e7c';
// const token = '3422828434d5cb258c54250f8abfb933';
  
// // Importing the Twilio module
// const twilio = require('twilio');
  
// // Creating a client
//  const client = twilio(id, token);

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

app.post('/api/saveUser', /*ensureAuthenticated,*/ function(req, res) {
    //Checking if username is already present in system
    users.findOne({ username: req.body.username }, '+password -documents')
    .exec(function (err,user){
      if (!user){ /// This means user is not present need to save it
           var lastRecId = 1;
           let user = new users({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              primaryAddress:{
                 addr1: req.body.addr1,
                    addr2: req.body.addr2,
                    city: req.body.city,
                    state: req.body.state,
                    postalCode: req.body.postalCode,
              } ,
              username: req.body.username,
              contactNo: req.body.contactNo,
              password: req.body.password,
              isAdmin:'endUser'
          });
          user.save(req.body.password,function(err, result) {
            if (err) {
              res.status(500).send({success:false, message: err.message });
              res.end();
            }else{
              if(result != undefined){
                res.jsonp({ success:true,data:result,token: createJWT(result) });
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

app.put('/api/changePassword:id',ensureAuthenticated, function(req, res) {
  users.findById(req.body.id,function (err, user) {
    if (error){
      res.jsonp(error);
      res.end();
    } 
    user.password = req.body.password ;
    user.save(function (err,tank) {
      if (err){
        res.jsonp({success: false,msg:err});
        res.end();
      }if(tank){
        res.jsonp({success: true,data:tank});
        res.end();
      }
    });
  });
});

app.post('/api/login',function(req, res) {
      users.findOne({ username: req.body.username, isActive: true }, '+password')
     .exec( function(err, user) {
      if (!user) {
            res.jsonp({
              success: false,
              message: "Invalid username"
            });
            res.end();
      }else{
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) {
              res.jsonp({
                  success: false,
                  message: "Invalid password"
                });
                res.end();
            }else{
              res.jsonp({
                success: true,
                token: createJWT(user),
                data:user
              });
              res.end();
            }
        });
      }
    });
});



app.post("/api/cart", async (req, res) => {
  const  productId = req.body.id;
  const quantity  = req.body.quantity;
  const owner = req.body.owner; //TODO: the logged in user id
  try {
    let cart = await orders.findOne({ owner,isPlaced:false });
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
      res.jsonp({
        data: cart,
        success:true
      });
      res.end();
    } else {
      //no cart for user, create new cart
      const newCart = await orders.create({
        owner,
        products: [{ productId, quantity}]
      });
      res.jsonp({
        data: newCart,
        success:true
      });
      res.end();
      //return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});

app.post('/api/recurringCart/:id', function(req, res) {
  var obj={};
  var owner;
  orders.findById(req.params.id,function(error,result){
     if (error) {
       res.jsonp(error);
       res.end();
    }
    if(result){
       obj = result.products;
       owner = result.owner;
    }
    const newCart = orders.create({
        owner,
        products:obj
      });
      res.jsonp({
        data: newCart,
        success:true
      });
      res.end();
  })
});

app.post('/api/getCart/:id', function(req, res) {
  orders.find({
    owner:req.params.id,
    isPlaced : false
  })
  .populate('products.productId')
  .exec(function(err,result){
    if(err){
      res.jsonp({ success:false,data:err});
      res.end();
    }
    if(result){
      res.jsonp({success: true,data:result});
      res.end();
    }else{
      //This means data not found
      res.jsonp({ success:false,msg:'No records available'});
      res.end();
    }
  });
});

app.get('/api/checkout/:id', function(req, res) {
 var sum = 0;
  orders.find({_id:req.params.id})
  .populate('products.productId','price')
  .populate('owner')
  .exec(function(err,result){
    if(err){
      res.jsonp({ success:false,data:err});
      res.end();
    }
    if(result){
       for(var i = 0 ; i < result[0].products.length ; i++){
        sum = sum + (result[0].products[i].quantity *  result[0].products[i].productId.price);
       }
       console.log( result[0].coupon)
       coupons.findOne({ code: result[0].coupon})
      .exec(function(err,rest){
        if(err){
          res.jsonp({ success:false,data:err});
         res.end();
        }
        if(rest && rest.isActive){
          console.log(rest.isActive);
          if(rest.isPercent){
              sum = sum - ((sum * rest.amount ) / 100 ); 
          }
          else{
            sum = sum - rest.amount ; 
          }
           
        }
      });


       orders.findById(req.params.id, function (error, rest) {
        if (error) {
            res.jsonp(error);
            res.end();
        }
        console.log("Sum:",sum);
        rest.total = sum*100 ;
           rest.save(function (err, data){
           });
      });
       res.jsonp({
            success: true,
            data : result,
        });
        res.end()
    }else{
      //This means data not found
    res.jsonp({ success:false,msg:'No records available'});
    res.end();
    }
  });
});

app.get('/api/getTotal/:id', function(req, res) {
  orders.find({_id:req.params.id})
  .populate('owner')
  .exec(function(err,result){
    if(err){
      res.jsonp({ success:false,data:err});
      res.end();
    }
    if(result){
      console.log(result);
       res.jsonp({
            success: true,
            data: result,
            total : result[0].total
        });
        res.end()
    }else{
      //This means data not found
    res.jsonp({ success:false,msg:'No records available'});
    res.end();
    }
  });
});

app.post('/api/applyCoupon', function(req, res) {
  var sum = 0; 
  coupons.findOne({ code: req.body.code})
  .exec(function(err,result){
    if(err){
      res.jsonp({ success:false,data:err});
     res.end();
    }
    if(result && result.isActive){
      console.log(result.isActive);
     
       orders.findById(req.body.id, function (error, rest) {
        if (error) {
            res.jsonp(error);
            res.end();
        }
         rest.coupon = req.body.code ;

            rest.save(function (err, data){
            });
      });
      res.jsonp({
            success: true,
            data : result,
            total: sum
        });
        res.end()
    }else{
      //This means data not found
    res.jsonp({ success:false,msg:'No records available'});
    res.end();
    }
  });
});

app.put('/api/placeOrder', function(req, res) {
  var obj;
  console.log("dsjkghuh");
  orders.findById(req.body.id)
   .populate('products.productId','totalStock')
   .populate('owner','primaryAddress')
   .exec(function(error,result){
     if (error) {
       res.jsonp(error);
       res.end();
    }
    if(result){
      for(var i = 0 ; i < result.products.length ; i++){
        var st = result.products[i].quantity;
        product.findById(result.products[i].productId.id,function(error,rest){
          if (error) {
            res.jsonp(error);
            res.end();
          }
          var updatedStock = rest.totalStock - st;
          rest.totalStock = updatedStock;
          rest.save(function (err, data){
          });
        })
      }
      if(req.body.delieveryAddress == "primary"){
        obj = {
        addr1 : result.owner.primaryAddress.addr1,
        addr2 : result.owner.primaryAddress.addr2,
        city : result.owner.primaryAddress.city,
        state : result.owner.primaryAddress.state,
        postalCode : result.owner.primaryAddress.postalCode
       };
      }
      if(req.body.delieveryAddress == "secondary"){
        obj = {
        addr1 : req.body.addr1,
        addr2 : req.body.addr2,
        city : req.body.city,
        state : req.body.state,
        postalCode : req.body.postalCode,
        contactNo : req.body.contactNo
       };
      }
      result.delieveryAddress = obj;
      var date = new Date();
      result.isPlaced=true;
      result.modifiedOn = date ;

      result.save(function (err, data){
      var str = bill(data);
      console.log("Str: ",str);
    //     client.messages
    // .create({
          
    //     // Message to be sent
    //     body: str,
  
    //     // Senders Number (Twilio Sandbox No.)
    //     from: 'whatsapp:+14155238886',
  
    //     // Number receiving the message
    //     to: 'whatsapp:+919075044114'
    // })
    // .then(message => console.log("Message sent successfully"))
    // .done();  
        
      });

  
// Sending messages to the client


    }
  })
});

function bill(obj){
    var str = "";
      str+="Thanks "+obj.delieveryAddress.addr1 ;
      return str;
}

app.put('/api/updatePrimary', function(req, res) {
  var obj;
  console.log("update");
  console.log(req.body)
  users.findById(req.body.id)
   .exec(function(error,result){
     if (error) {
       res.jsonp(error);
       res.end();
    }
    if(result){
        obj = {
        addr1 : req.body.addr1,
        addr2 : req.body.addr2,
        city : req.body.city,
        state : req.body.state,
        postalCode : req.body.postalCode
       };
      }
      result.primaryAddress = obj;
      result.save(function (err, data){
        if(err){
         res.jsonp({
            success: false,
            data: 'Update failed',err
          });
          res.end();
        }
        console.log("DTA");
        res.jsonp({ success: true, data:'saved' });
      });
  })
});


app.post("/api/removeProductFromCart", function(req, res) {
  orders.updateOne(
  { _id: req.body.id },
  { $pull: { 'products': { productId: req.body.pid } } }) 
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

app.put('/api/cancelOrder/:id', function(req,res){
    orders.findById(req.params.id)
   .populate('products.productId','totalStock')
   .populate('owner','primaryAddress')
   .exec(function(error,result){
    if (error) {
       res.jsonp(error);
       res.end();
    }
    if(result){
      for(var i = 0 ; i < result.products.length ; i++){
        var st = result.products[i].quantity;
        product.findById(result.products[i].productId.id,function(error,rest){
          if (error) {
            res.jsonp(error);
            res.end();
          }
          var updatedStock = rest.totalStock + st;
          rest.totalStock = updatedStock;
          rest.save(function (err, data){
          });
        })
      }
     }
  })
  orders.findByIdAndRemove(req.params.id, function (err,result){
    if(err){
      res.jsonp({
        success: false,
        data:err

      });
      res.end();
    }
    if(result){
      res.jsonp({success:true, data: result});
      res.end();
    }
  });
})

app.get('/api/getPlacedOrderByUser/:id', function(req, res) {
  orders.find({'isPlaced':true, 'isDelievered':false,owner:req.params.id})
  .populate('products.productId','name price')
  .populate('owner')
  .exec(function(err,result){
    if(err){
      res.jsonp({ success:false,data:err});
      res.end();
    }
    if(result){   
      res.jsonp({ success:true,data:result});
      
      }else{
      //This means data not found
      res.jsonp({ success:false,msg:'No records available'});
      res.end();
    }
  });
});

app.get('/api/getDeliveredOrdersOfUser/:id', function(req, res) {
  orders.find({'isDelievered':true , owner:req.params.id})
  .populate('products.productId','name price')
  .populate('owner','username')
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

app.post('/api/saveReview', function(req, res) {
  let param = new review({
    owner:req.body.owner , 
    comment:req.body.comment, 
    rating: req.body.rating, 
    product : req.body.product,
  });
  param.save().then(function(data){
    res.jsonp({success:true,data:data});
    res.end();
  },function(err){
    res.jsonp({success:false,data:'Save failed: ',err});
    res.end();
  })
 });

app.get('/api/getReviewOfProduct/:id', function(req, res) {
  review.find({product:req.params.id})
  .populate('product','name price')
  .populate('owner','username')
  .exec(function(err,result){
    if(err){
      console.log("Error",err);
      res.jsonp({ success:false,data:err});
      res.end();
    }
    if(result){ 
      res.jsonp({ success:true,data:result});
      }else{
      //This means data not found
      res.jsonp({ success:false,msg:'No records available'});
      res.end();
    }
  });
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


module.exports = app ;
