'use strict';
let allSchema = require('./schemas');
let mongoose = require('mongoose');
let Schema = mongoose.Schema ;

//  Schema for Account collection
let ReviewSchema = new Schema(allSchema.ReviewSchema);

let reviews = mongoose.model('reviews', ReviewSchema);

module.exports = reviews;