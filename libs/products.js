'use strict';
//save user api
const express = require("express");
let mongoose = require('mongoose');
let product = require('./models/product');
let coupon = require('./models/coupon');
let bodyParser = require("body-parser");
let config = require('../config');
const multer = require('multer');
let users = require('./models/user');
let orders = require('./models/order');
let image = require('./models/image');
let data = require('./models/data')
let ensureAuthenticated = require('./auth');
let app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false,limit: '50mb' }));


app.set("jsonp callback", true);
app.get('/api/products', function(req, res) {
   product.find({}, function(err,result){
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
});


app.get('/api/homeproducts', function(req, res) {
  image.find({index:1,category:"product",'isActive':true,isDeleted:false})
  .populate('productId','name isActive')
  .exec(function(err,result){
   if(err){
     res.jsonp({ success:false,data:err});
     res.end();
   }
   if(result){  
      var obj = [] ;
      for(var i=0;i<result.length;i++){
          if(result[i].productId.isActive === true){
            var count = obj.push(result[i]);
          }
      }
      res.jsonp({success:true, data: obj.slice(0,4)});
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
  image.find({isActive: true , index : 1, category:"product",isDeleted:false})
  .populate('productId','name isActive')
  .exec(function(err,result){
   if(err){
     res.jsonp({ success:false,data:err});
     res.end();
   }
   if(result){  
      var obj = [] ;
      for(var i=0;i<result.length;i++){
        console.log(result[i].productId.isActive)
          if(result[i].productId.isActive === true){
            console.log("yes")
            var count = obj.push(result[i]);
          }
      }
      console.log(obj);
      res.jsonp({success:true, data: obj});
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
    isActive :  req.body.isActive ,
  });
  param.save().then(function(data){
    res.jsonp({success:true,data:data});
    res.end();
  },function(err){
    res.jsonp({success:false,data:'Save failed: ',err});
    res.end();
  })
 });
// homeText : String,
//     data : [{
//       name: String,
//       designation : String,
//       comment : String,
//       category : { type : String, 
//                     enum : ["team","testimonial"]}
//     }],
//     intro1  : String,
//     intro2 : String,
//     vision: String,
//     mission : String,
app.post('/api/saveData', function(req, res) {

  let param = new data({
    homeText:req.body.homeText , 
    intro1:req.body.intro1, 
    intro2: req.body.intro2, 
    vision : req.body.vision,
    mission :  req.body.mission ,
    data : {
      name: req.body.name,
      designation: req.body.designation,
      comment: req.body.comment,
      category: req.body.category,
      image : req.body.image
    }
  });
  param.save().then(function(data){
    res.jsonp({success:true,data:data});
    res.end();
  },function(err){
    res.jsonp({success:false,data:'Save failed: ',err});
    res.end();
  })
 });


app.put('/api/updateData', function(req, res) {
  data.findById(req.body.id,function(error,result){
     if (error) {
       res.jsonp(error);
       res.end();
    }
    let field = req.body.field;
    if(field=="homeText"){
      result.homeText=req.body.value;
    }
    if(field=="vision"){
      result.vision=req.body.value;
    }
    if(field=="mission"){
      result.mission=req.body.value;
    }
    if(field=="intro1"){
      result.intro1=req.body.value;
    }
    if(field=="intro2"){
      result.intro2=req.body.value;
    }
    if(field=="data"){
      result.data.push({
         name: req.body.name,
         designation :req.body.designation,
         comment : req.body.comment,
         category: req.body.category,
         image : req.body.image
      })
    }
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

app.put('/api/updateTeam', function(req, res) {
 if(!req.body.data){
    console.log("Not found");
    return;
  }
  data.findById(req.body._id,function(error,result){
     if (error) {
       res.jsonp(error);
       res.end();
    }
  if(result){
    result.data = req.body.data;
    result.save(function (err, data){
      if(err){
        console.log("Error")
       res.jsonp({
          success: false,
          data: 'Update failed',err
        });
        res.end();
      }
      if(data){
        res.jsonp({
          success: true,
          data:'saved'
        });
      }
      else{
        console.log("Problem")
      }

    });
 }
});
});

app.get('/api/getData', function(req, res) {
  data.find()
  .exec(function(err,result){
   if(err){
     res.jsonp({ success:false,data:err});
     res.end();
   }
   if(result){  
      res.jsonp({success:true, data: result[0]});
      res.end();
   }
   else{
     //This means data not found
     res.jsonp({ success:false,data:'data not found'});
     res.end();
   }
  })
});




app.post('/api/saveImage', function(req, res) {
  req.body.productId = req.body.productId == "" ? "" : req.body.productId ;
    let img = new image({
      name:req.body.name , 
      index:req.body.index, 
      category : req.body.category,
      isDeleted :  false ,
      productId:req.body.productId
    });
    img.save().then(function(data){
      res.jsonp({success:true,data:data});
      res.end();
    },function(err){
      res.jsonp({success:false,data:'Save failed: ',err});
      res.end();
    })
});



app.get('/api/getImages', function(req, res) {
  image.find()
  .populate('productId','name isActive')
  .exec(function(err,result){
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

app.get('/api/getImageByProduct/:id', function(req, res) {
  image.find({productId:req.params.id, isDeleted:false})
  .populate('productId','name isActive')
  .exec(function(err,result){
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

app.get('/api/getImageByProductAdmin/:id', function(req, res) {
  image.find({productId:req.params.id})
  .populate('productId','name isActive')
  .exec(function(err,result){
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

app.get('/api/getImageByCategory/:category', function(req, res) {
  image.find({category:req.params.category,isDeleted : false})
  .exec(function(err,result){
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

app.get('/api/getImageByCategoryAdmin/:category', function(req, res) {
  image.find({category:req.params.category})
  .exec(function(err,result){
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
app.put('/api/updateSequence', function(req, res) {
  if(!req.body.data){
    console.log("Not found");
    return;
  }
  var object = req.body.data;
  object.sort((a, b) => a.index - b.index);
  Promise.all(
    object.map(async (obj) => {
      await image.findOneAndUpdate({_id:obj._id }, {$set: {index: obj.index,isDeleted:obj.isDeleted}});
    })
  ).then(function (data) {
         res.jsonp({
          success: true,
          data:'Image sequence updated'
        });
        res.end();
      });
});


app.get("/api/productdetail/:id", async (req, res) => {
 image.find({productId:req.params.id})
 .populate('productId')
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
     res.jsonp({ success:false,data:'data not found'});
     res.end();
   }
  })
});

app.put('/api/updateProduct',function(req, res) {
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
    //result.images.push(req.body.image);
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
  product.findByIdAndRemove(req.params.id, function (err,result){
    if(err){
      console.log("error");
      res.jsonp({
        success: false,
        data:err

      });
      res.end();
    }
    if(result){
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

app.get('/api/coupons', function(req, res) {
   coupon.find({}, function(err,result){
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
});


app.get('/api/getSingleCoupon/:id', function(req, res) {
  coupon.findById(req.params.id)
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
    res.jsonp({
        success: true,
        data:result
      });
      res.end()
    }
  });
});


app.put('/api/updateCoupon', function(req, res) {
  coupon.findById(req.body.id,function(error,result){
     if (error) {
       res.jsonp(error);
       res.end();
    }
    result.code=req.body.code;
    result.amount=req.body.amount;
    result.isPercent=req.body.isPercent;
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

app.post('/api/loremipsumdolorsitametconsecteturadipiscingelitseddoeiusmod', function(req, res) {
  let param = new users({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      contactNo: req.body.contactNo,
      password: req.body.password,
      isAdmin:'owner'
  });
  param.save().then(function(data){
    res.jsonp({success:true,data:data});
    res.end();
  },function(err){
    res.jsonp({success:false,data:'Save failed: ',err});
    res.end();
  })
 });


app.get('/api/getAdmins', function(req, res) {
  users.find({'isAdmin':'owner'})
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

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'dist/images')
    },
    filename: (req, file, callBack) => {
        callBack(null, file.originalname)
    }
  })
  
const upload = multer({ storage: storage })
   
//let upload = multer({ dest: 'src/images' })
app.post('/api/file', upload.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send(file);
  })


const storage1 = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'src/images')
    },
    filename: (req, file, callBack) => {
        callBack(null, file.originalname)
    }
  })
  
const upload1 = multer({ storage: storage1 })
   
//let upload = multer({ dest: 'src/images' })
app.post('/api/file1', upload1.single('file'), (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error('No File')
      error.httpStatusCode = 400
      return next(error)
    }
      res.send(file);
  })


module.exports = app ;