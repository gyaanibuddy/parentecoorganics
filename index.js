var Express    =  require("express"),
    app        = Express(),
    path       =require("path"),
    bodyParser = require("body-parser"),
    MongoClient = require("mongodb").MongoClient,
    mongoose   = require("mongoose");
    
var productRoutes = require("./routes/products");
var userRoutes = require("./routes/users");
const mongoURI = 'mongodb://127.0.0.1:27017/veg';
 

app.use(bodyParser.urlencoded({extended:true}));
app.set('views',path.join(__dirname,'views'));
app.set("views", path.join(__dirname,'views/partials'));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(Express.static(__dirname + '/public'));


app.set("jsonp callback", true);
app.use(productRoutes);
app.use(userRoutes);
mongoose.connect(mongoURI, {
  useNewUrlParser: true ,
  useUnifiedTopology: true,
  useCreateIndex : true,
  useFindAndModify : false
  }).then({},
   function (error) {

    if (error) {
        console.log('Error:' , error);
    }
 });

app.use("/products",productRoutes);

app.listen(process.env.PORT || 9001, () => {

    app.listen();
    console.log('Server started on ' + (process.env.PORT || 9001) );
});
