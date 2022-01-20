'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema ;

let allSchema = {

  ProductSchema : {
    // images: 
    // [{
    //   name: {type: String, unique: true},
    //   index: Number,
    //   isDeleted: Boolean
    // }],
    name: String,
    description: String,
    price: Number,
    totalStock: Number,
    created: { type: Date, default: Date.now },
    isActive:{ type: Boolean, default: true } ,
  },

  UserSchema : {
   // email: { type: String, unique: true, lowercase: true },
    username: { type: String, unique: true },
    contactNo: { type: String},
    firstName: String,
    lastName: String,
    password:{ type: String} ,
    picture: String,
    primaryAddress: {
      addr1: String,
      addr2: String,
      city: String,
      state: String,
      postalCode: String
    },
    secondaryAddress : {
      addr1: String,
      addr2: String,
      city: String,
      state: String,
      postalCode: String
    },
    //giftAddress

     isAdmin: { type: String,
               enum: ['owner','endUser'], 
               default: 'endUser', 
               required: [true,'permission required']
    },
    registerDate: { type: Date, default: Date.now },
  },

  ReviewSchema : {
      owner: { type: Schema.Types.ObjectId, ref: 'users' },
      comment: String,
      rating: { type: Number, default: 0},
      created: { type: Date, default: Date.now },
      product: { type: Schema.Types.ObjectId, ref: 'products'},
  },

  OrderSchema : {
      owner: { type: Schema.Types.ObjectId, ref: 'users'},
      modifiedOn: { type: Date, default: Date.now },
      products: [{
        productId: { type: Schema.Types.ObjectId, ref: 'products'},
        quantity: { type: Number, default: 1 }
    }],
    isPlaced : {type: Boolean, default: false },
    isDelievered : { type: Boolean, default: false },
    total :  {type: Number , default: 0},
    status: {
       type: String,
               enum: ['process','package','onway'], 
               default: 'process', 
               required: [true,'status required']
    },
    delieveryAddress : {
      addr1: String,
      addr2: String,
      city: String,
      state: String,
      postalCode: String,
      contactNo:String
    },
    coupon: {type: String}
  },

  PaymentSchema : {
    orderId : { type: Schema.Types.ObjectId, ref: 'orders'},
    owner: { type: Schema.Types.ObjectId, ref: 'users'},
    type: String,
    paidOn: { type: Date, default: Date.now }
  },

  CouponSchema : {
    code: { type: String, require: true, unique: true },
    isPercent: { type: Boolean, require: true, default: true },
    amount: { type: Number, required: true }, // if is percent, then number must be ≤ 100, else it’s amount of discount
    isActive: { type: Boolean, require: true, default: true }
  },
   ImageSchema : {
      name: {type: String, unique: true},
      index: Number,
      isDeleted: Boolean,
      category: String,
      productId: { type: Schema.Types.ObjectId, ref: 'products'}
  },
   DataSchema : {
    homeText : String,
    intro1  : String,
    intro2 : String,
    vision: String,
    mission : String,
    data : [{
      name: String,
      designation : String,
      comment : String,
      category : { type : String, 
                    enum : ["team","testimonial"]},
      image: String
    }],
    
  }
  
  
}
  

module.exports = allSchema ;
