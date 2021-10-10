'use strict';

let allSchema = require('./schemas');
let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let Schema = mongoose.Schema ;
//var passportLocalMongoose =require('passport-local-mongoose');
let UserSchema = new Schema(allSchema.UserSchema,                               {
    toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true 
    }
});

UserSchema.pre('save', function(next,pwd) {
  let user = this;
	//console.log('user data' , user);
  if(pwd!=''){
		//console.log('password:', pwd);
    user.password=pwd;
  }
  //console.log('isModified', user.isModified('password'), user.password);
  if (!user.isModified('password') /*&& user.password=='' */) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
			//console.log('new new password', user.password);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};


//UserSchema.plugin(passportLocalMongoose);
let users = mongoose.model('users', UserSchema);

module.exports = users ;
