var mongoose = require("mongoose");
var dto = require("../model/Contact.js");
var schema = dto.schema;

schema.statics = {
    create: function(data, callback) {
        var contact = new this(data);
        contact.save(callback);
    },
    getById: function(id, callback) {
        this.find({_id: id}, callback);
    },
    getALl: function(query, callback) {
        this.find(query, callback);
    },
    updateById: function(id, data, callback) {
        this.findByIdAndUpdate(id, {$set: data}, {new: true}, callback);
    },
    updateMany: function(query, data, callback) {
        this.updateMany(query, {$set: data}, callback);
    },
    deleteById: function(id, callback) {
        this.findByIdAndUpdate(id, {$set: {deleted: true}}, callback);
    }
};

module.exports = mongoose.model(dto.name, schema);
