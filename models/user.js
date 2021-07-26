'use strict';

let allSchema = require('./schemas');
let mongoose = require('mongoose');
let Schema = mongoose.Schema ;
var passportLocalMongoose =require('passport-local-mongoose');
let UserSchema = new Schema(allSchema.UserSchema,                               {
    toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true 
    }
});

UserSchema.plugin(passportLocalMongoose);
let users = mongoose.model('users', UserSchema);

module.exports = users ;
