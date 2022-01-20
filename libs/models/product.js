'use strict';
let allSchema = require('./schemas');
let mongoose = require('mongoose');
let Schema = mongoose.Schema ;

//  Schema for Account collection
let ProductSchema = new Schema(allSchema.ProductSchema);

let products = mongoose.model('products', ProductSchema,'products');

module.exports = products;