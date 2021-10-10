'use strict';
let allSchema = require('./schemas');
let mongoose = require('mongoose');
let Schema = mongoose.Schema ;

//  Schema for Account collection
let CouponSchema = new Schema(allSchema.CouponSchema);

let coupons = mongoose.model('coupons', CouponSchema,'coupons');

module.exports = coupons;