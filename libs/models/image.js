'use strict';
let allSchema = require('./schemas');
let mongoose = require('mongoose');
let Schema = mongoose.Schema ;

//  Schema for Account collection
let ImageSchema = new Schema(allSchema.ImageSchema);

let images = mongoose.model('images', ImageSchema,'images');

module.exports = images;