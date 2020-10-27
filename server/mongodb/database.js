var mongoose = require("mongoose");
var dbUrl = require("../properties.js").DB;

module.exports.connect  = function() {
    console.log("# mongodb try to connect", dbUrl);
    mongoose.connect(dbUrl, {server:{auto_reconnect:true}, useNewUrlParser: true});
    mongoose.connection.on('connected', function(){
        console.log("Mongoose default connection is open to ", dbUrl);
    });
    mongoose.connection.on('error', function(err){
        console.log("Mongoose default connection has occured "+err+" error");
    });
    mongoose.connection.on('disconnected', function(){
        console.log("Mongoose default connection is disconnected");
    });
    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log("Mongoose default connection is disconnected due to application termination");
            process.exit(0)
        });
    });
}

module.exports.create = function(Clazz, data, callback) {
    console.log(" # [DB] - Insert " + Clazz.collection.name + " - ", data);
    var model = new Clazz(data);
    model.save(callback);
};

module.exports.getById = function(Clazz, id, callback) {
    console.log(" # [DB] - Get " + Clazz.collection.name + " by id:", id);
    Clazz.findById(id, callback);
};


module.exports.findOne = function(Clazz, query, callback) {
    console.log(" # [DB] - Get first by condition", query);
    Clazz.findOne(query, callback);
};

module.exports.find = function(Clazz, query, callback) {
    console.log(" # [DB] - Get All " + Clazz.collection.name + " by condition:", query);
    Clazz.find(query, callback);
};

module.exports.updateById = function(Clazz, id, data, callback) {
    console.log(" # [DB] - Update " + Clazz.collection.name + " by id: " + id + " with new data:", data);
    Clazz.findByIdAndUpdate(id, {$set: data}, callback);
};

module.exports.findOneAndUpdate = function(Clazz, query, data, callback) {
    console.log(" # [DB] - Find by condition", query, "and update data:", data);
    Clazz.findOneAndUpdate(query, {$set: data}, callback);
}

module.exports.updateMany = function(Clazz, query, data, callback) {
    console.log(" # [DB] - Update all " + Clazz.collection.name + " by condition:", query, "with new data:", data);
    Clazz.updateMany(query, {$set: data}, callback);
};

module.exports.deleteById = function(Clazz, id, callback) {
    console.log(" # [DB] - Delete " + Clazz.collection.name + " by id: " + id);
    Clazz.findByIdAndUpdate(id, {$set: {deleted: true}}, callback);
};

