'use strict';

const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require('mongoose');
const cors = require('cors');
const ObjectId = require("mongodb").ObjectID;
const path = require('path');
const CONNECTION_URL = "mongodb://127.0.0.1:27017/veg";

const users = require('./libs/users');
const products = require('./libs/products');
const razorpay = require('./libs/razorpay');
var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;



app.use(cors());

app.use("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});

app.use(Express.static(path.join(__dirname, 'dist')));
app.use(Express.static('uploads'));
app.use('/', Express.static(path.join(__dirname, 'dist/index.html')));
app.use('/login', Express.static(path.join(__dirname, 'dist/index.html')));
app.use('/ourproducts', Express.static(path.join(__dirname, 'dist/index.html')));
app.use('/home', Express.static(path.join(__dirname, 'dist/index.html')));
app.use('/getCart', Express.static(path.join(__dirname, 'dist/index.html')));
app.use('/contact', Express.static(path.join(__dirname, 'dist/index.html')));
app.use('/register', Express.static(path.join(__dirname, 'dist/index.html')));
app.use('/productdetail/*', Express.static(path.join(__dirname, 'dist/index.html')));
app.use('/checkout/*', Express.static(path.join(__dirname, 'dist/index.html')));
app.use('/about', Express.static(path.join(__dirname, 'dist/index.html')));
app.use('/adminProduct', Express.static(path.join(__dirname, 'dist/index.html')));
app.use('/adminPlaced', Express.static(path.join(__dirname, 'dist/index.html')));
app.use('/adminDelievered', Express.static(path.join(__dirname, 'dist/index.html')));
app.use('/placeHistory', Express.static(path.join(__dirname, 'dist/index.html')));
app.use('/delieverHistory', Express.static(path.join(__dirname, 'dist/index.html')));



app.use(users);
app.use(products);
app.use(razorpay);

app.set("jsonp callback", true);
app.set('view engine', 'ejs');

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true ,
  useUnifiedTopology: true,
  // useCreateIndex : true,
  // useFindAndModify : false
  }).then({},
   function (error) {

    if (error) {
        console.log('Error:' , error);
    }
 });
//app.use(function(req, res, next){
   // res.locals.user = req.user;
   // res.locals.error = req.flash("error");
    //res.locals.success = req.flash("success");
    //next();
//});
//app.use("/products",productRoutes);

// when status is 404, error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    if( 404 === err.status  ){
        res.format({
            'text/plain': () => {
                res.send({message: 'not found Data'});
            },
            'text/html': () => {
                res.send({message: '404 not found'});
                //res.render('404.ejs');
            },
            'application/json': () => {
                res.send({message: 'not found Data'});
            },
            'default': () => {
                res.status(406).send('Not Acceptable');
            }
        })
    }

    // when status is 500, error handler
    if(500 === err.status) {
        return res.send({message: 'error occur'});
    }
});

app.listen(process.env.PORT || 9001, () => {

    app.listen();
    console.log('Server started on ' + (process.env.PORT || 9001) );
});
