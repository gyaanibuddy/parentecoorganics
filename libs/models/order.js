'use strict';
let allSchema = require('./schemas');
let mongoose = require('mongoose');
let Schema = mongoose.Schema ;

//  Schema for Account collection
let OrderSchema = new Schema(allSchema.OrderSchema);

let orders = mongoose.model('orders', OrderSchema);

module.exports = orders;