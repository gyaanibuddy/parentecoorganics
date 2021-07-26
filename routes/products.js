'use strict';
//save user api
const express = require("express");
let mongoose = require('mongoose');
let product = require('../models/product');
let bodyParser = require("body-parser");

//let moment = require('moment');
let app = express();

app.get('/cart',function(req, res) {
  res.render('cart',{success:'true'});
});
app.get('/',function(req, res) {
	console.log("products..");
       product.find({}, function(err,result){
             if(err){
               res.jsonp({ success:false,data:err});
               res.end();
             }
             if(result){
               //res.jsonp({ success:true,data:result});
               
               res.render('home', { title: 'product Records', records:result });
               console.log("products..");
               res.end();

             }else{
               //This means data not found
               res.jsonp({ success:false,data:'data not found'});
               res.end();
             }
         })
      
});


app.post('/saveProduct', function(req, res) {
	let param = new product({name:req.body.name , description:req.body.description, price: req.body.price});
          param.save().then(function(data){
            res.jsonp({success:true,data:data});
            res.end();
          },function(err){
            res.jsonp({success:false,data:'Save failed: ',err});
            res.end();
          })
 });
module.exports = app ;