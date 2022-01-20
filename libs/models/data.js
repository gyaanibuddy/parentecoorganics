'use strict';
let allSchema = require('./schemas');
let mongoose = require('mongoose');
let Schema = mongoose.Schema ;

//  Schema for Account collection
let DataSchema = new Schema(allSchema.DataSchema);

let datas = mongoose.model('datas', DataSchema,'datas');

module.exports = datas;