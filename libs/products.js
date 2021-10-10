'use strict';
//save user api
const express = require("express");
let mongoose = require('mongoose');
let product = require('./models/product');
let coupon = require('./models/coupon');
let bodyParser = require("body-parser");
let config = require('../config');

let users = require('./models/user');
let orders = require('./models/order');
let ensureAuthenticated = require('./auth');//const {isLoggedIn} = require('./auth') 
//let moment = require('moment');
let app = express();


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false,limit: '50mb' }));

app.set("jsonp callback", true);


app.get('/api/products', function(req, res) {
	console.log("products..");
       product.find({}, function(err,result){
             if(err){
               res.jsonp({ success:false,data:err});
               res.end();
             }
             if(result){
             res.jsonp({ success:true,data:result});
               
           //  res.render('admin', { title: 'product Records',  user:req.user, records:result });
               console.log("products..");
               res.end();

             }else{
               //This means data not found
               res.jsonp({ success:false,data:'data not found'});
               res.end();
             }
         })
      
});


app.get('/api/homeproducts', function(req, res) {
  product.find({isActive: true    }, function(err,result){
   if(err){
     res.jsonp({ success:false,data:err});
     res.end();
   }
   if(result){  
      res.jsonp({success:true, data: result.slice(0,4)});
      res.end();
   }
   else{
     //This means data not found
     res.jsonp({ success:false,data:'data not found'});
     res.end();
   }
  })
});

app.get('/api/ourproducts', function(req, res) {
  product.find({isActive: true    }, function(err,result){
   if(err){
     res.jsonp({ success:false,data:err});
     res.end();
   }
   if(result){  
      res.jsonp({success:true, data: result});
      res.end();
   }
   else{
     //This means data not found
     res.jsonp({ success:false,data:'data not found'});
     res.end();
   }
  })
});

app.post('/api/saveProduct', function(req, res) {

  req.body.isActive = req.body.isActive == "" ? false : req.body.isActive ;
	let param = new product({
    name:req.body.name , 
    description:req.body.description, 
    price: req.body.price, 
    totalStock : req.body.totalStock,
    isActive :  req.body.isActive 
  });
  param.save().then(function(data){
    res.jsonp({success:true,data:data});
    res.end();
  },function(err){
    res.jsonp({success:false,data:'Save failed: ',err});
    res.end();
  })
 });

app.put('/api/saveImage/:id', function(req, res) {
  product.findById(req.params.id,function(error,result){
    console.log("In saveImage");
     if (error) {
      console.log("err");
       res.jsonp(error);
       res.end();
    }
    if(result){
      console.log(result);
      const image  = req.body.image;
        result.images.push(image);
        result.save(function (err, data){
          if(err){
           res.jsonp({
              success: false,
              data: 'Update failed',err
            });
            res.end();
          }
          res.jsonp({
              success: true,
              data:'saved'
      });

    });
    }
  })
});



app.put('/api/updateProduct', function(req, res) {
  product.findById(req.body.id,function(error,result){
     if (error) {
       res.jsonp(error);
       res.end();
    }
    
    result.name=req.body.name;
    result.description=req.body.description;
    result.price=req.body.price;
    result.totalStock=req.body.totalStock;
    result.isActive=req.body.isActive;
    result.save(function (err, data){
      if(err){
       res.jsonp({
          success: false,
          data: 'Update failed',err
        });
        res.end();
      }
      res.jsonp({
          success: true,
          data:'saved'
      });

    });
  })
});

app.put('/api/updateStatus', function(req, res) {
  orders.findById(req.body.id,function(error,result){
     if (error) {
       res.jsonp(error);
       res.end();
    }
    result.status=req.body.status;
    result.save(function (err, data){
      if(err){
       res.jsonp({
          success: false,
          data: 'Update failed',err
        });
        res.end();
      }
      res.jsonp({
          success: true,
          data:'saved'
      });

    });
  })
});


app.delete('/api/deleteProduct/:id', function(req,res){
  console.log(req.params.id);
  product.findByIdAndRemove(req.params.id, function (err,result){
    console.log("found");
    if(err){
      console.log("error");
      res.jsonp({
        success: false,
        data:err

      });
      res.end();
    }
    if(result){
      console.log("result");
      res.jsonp({success:true});
      res.end();
    }
  });

})



app.get('/api/getSingleProduct/:id', function(req, res) {
  product.findById(req.params.id)
  .exec(function (err, result){
    if (err){
      res.jsonp({
        success: false,
        data:err
      });
      res.end();
      }
    if(result){
       var date = new Date();
       console.log(date) ;
    res.jsonp({
        success: true,
        data:result
      });
      res.end()
    }
  });
});


app.put('/api/delieverOrder', function(req, res) {
  orders.findById(req.body.id, function (error, result) {
     if (error) {
        res.jsonp(error);
        res.end();
      }
    result.isDelievered=true;
    result.save(function (err,data) {
      if (err) {
        res.jsonp({
          success: false,
          msg: 'Approve failed',err
        });
        res.end();
      }
      if (data){
        res.jsonp({
        success: true,
        data:'saved'
      });
      res.end();
      }
      
    });
  });
});


app.get('/api/getPlacedOrders', function(req, res) {
  orders.find({'isPlaced':true, 'isDelievered' : false})
  .populate('owner')
  .populate('products.productId')
  .exec(function(err,result){
    if(err){
      res.jsonp({ success:false,data:err});
      res.end();
    }
    if(result){
           res.jsonp({ success:true,data:result});   res.end();
    }else{
      //This means data not found
      res.jsonp({ success:false,msg:'No records available'});
      res.end();
    }
  });
});

app.get('/api/getDelieveredOrders', function(req, res) {
  orders.find({'isDelievered':true})
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



app.post('/api/saveCoupon', function(req, res) {

  req.body.isActive = req.body.isActive == "" ? false : req.body.isActive ;
  let param = new coupon({
    code: req.body.code , 
    isPercent :req.body.isPercent, 
    amount : req.body.amount,
    isActive :  req.body.isActive 
  });
  param.save().then(function(data){
    res.jsonp({success:true,data:data});
    res.end();
  },function(err){
    res.jsonp({success:false,data:'Save failed: ',err});
    res.end();
  })
 });




module.exports = app ;