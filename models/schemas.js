'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema ;

let allSchema = {

  ProductSchema : {
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review'}],
    image: String,
    name: String,
    description: String,
    price: Number,
    totalStock: Number,
    created: { type: Date, default: Date.now }
  },

  UserSchema : {
    email: { type: String, unique: true, lowercase: true },
    username: { type: String, unique: true },
    contactNo: { type: String, unique: true},
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
    registerDate: { type: Date, default: Date.now },
  },

  ReviewSchema : {
      owner: { type: Schema.Types.ObjectId, ref: 'users' },
      comment: String,
      rating: { type: Number, default: 0},
      created: { type: Date, default: Date.now }
  },

  OrderSchema : {
      owner: { type: Schema.Types.ObjectId, ref: 'users'},
      modifiedOn: { type: Date, default: Date.now },
      products: [{
        productId: { type: Schema.Types.ObjectId, ref: 'products'},
        quantity: { type: Number, default: 1 }
    }]
  },

  PaymentSchema : {
    orderId : { type: Schema.Types.ObjectId, ref: 'orders'},
    owner: { type: Schema.Types.ObjectId, ref: 'users'},
    type: String,
    paidOn: { type: Date, default: Date.now }
  }

}
  

module.exports = allSchema ;
