var mongoose = require("mongoose");
var dto = require("../model/Room.js");
var schema = dto.schema;

schema.statics = {

}

var model = mongoose.model(dto.name, schema);
module.exports = model;
