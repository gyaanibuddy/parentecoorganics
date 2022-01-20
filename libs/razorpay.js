// let Razorpay = require('razorpay');

// var instance = new Razorpay({
//     key_id: 'rzp_test_6SnVpkNnCk4OP1',
//     key_secret: 'XPhMamwK1fZu8alm46PS68js'
//   });

// var express   = require('express');
// var app       = express();
// var bodyParser = require('body-parser');

// // these line is important. Include it before setting up the webhook handler.
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

// var amount= 2000,
//     currency='INR',
//     receipt = '1234545f4',
//     payment_capture =true,
//     notes ="something",
//     order_id,payment_id;

// app.get('/check', (req, res) => {
    
// instance.orders.create({amount, currency, receipt, payment_capture, notes}).then((response) => {
//     console.log("**********Order Created***********");
//     console.log(response);
//     console.log("**********Order Created***********");
// order_id=response.id;

// }).catch((error) => {
//   console.log(error);
// })
// // instance.payments.capture(order_id, amount).then((response) => {
// //     console.log(response);
// // }).catch((error) => {
// //   console.log(error);
// // });
// // res.render(
// //       'index',
// //       {order_id:order_id,amount:amount}
// //     );
// console.log(order_id,amount);
// });
// // res.jsonp({
// //             success: true,
// //             order_id:order_id,
// //             amount:amount
// //           });
// /*****************
//  * Payment status*
//  *****************/
// app.post('/purchase', (req,res) =>{
//     payment_id =  req.body;
//     console.log("**********Payment authorized***********");
//     console.log(payment_id);
//     console.log("**********Payment authorized***********");
//     instance.payments.fetch(payment_id.razorpay_payment_id).then((response) => {
//     console.log("**********Payment instance***********");
//     console.log(response); 
//     console.log("**********Payment instance***********")
//     instance.payments.capture(payment_id.razorpay_payment_id, response.amount).then((response) => {
//     res.send(response);
// }).catch((error) => {
//   console.log(error);
// });


// }).catch((error) => {
//   console.log(error);
// });

// })
// module.exports = app ;

const express = require("express");
const path = require("path");
const Razorpay = require("razorpay");


const app = express();

var razorpay = new Razorpay({
  key_id: 'rzp_live_rHjUd9gnzkXnOD',
 //key_id:'rzp_test_6SnVpkNnCk4OP1',
  key_secret: 'cWDbMf8sqHSkYfRU9dm2lGe1',
 //key_secret:'XPhMamwK1fZu8alm46PS68js'
});


app.post("/verification", (req, res) => {
  const secret = "razorpaysecret";
  console.log(req.body);
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  console.log(digest, req.headers["x-razorpay-signature"]);
  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    res.status(200).json({
      message: "OK",
    });
  } else {
    res.status(403).json({ message: "Invalid" });
  }
});

app.get("/api/razorpay/:tot", async (req, res) => {
  const payment_capture = 1;
  const amount = req.params.tot;
  const currency = "INR";

  const options = {
    amount,
    currency,
    receipt: '1234545f4',
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    console.log(response);
    res.status(200).jsonp({
     success:"true",
     data:response
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = app ;