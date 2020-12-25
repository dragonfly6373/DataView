#!/bin/node
var path = require("path");
var {Condition, Order, DbJoin, DB} = require("../server/lib/db");
var {Account, Location, Member, Store} = require("../server/model");

var samplenames = require("../server/data/common-name-us.json");
var locdata = require("../location-vn.json")

// DB.config({dbname: path.resolve("./data.db")});

function initDb() {
    new Promise(function(resolve, reject) {
        DB.beginTransaction(callback, (pool) => {
            pool.create(Account, () => {
                pool.create(Location, () => {
                    pool.create(Member, () => {
                        pool.create(Store, () => {
                            pool.commit();
                            resolve(true);
                        });
                    });
                });
            });
        });
    });
}

function importData() {
    importAccountData(samplename.firstname.male, samplename.lastname);
    importAccountData(samplename.firstname.female, samplename.lastname);
    importLocationData(locdata.data, {id: 0}, 10);
}

function importAccountData(firstNames, lastNames) {
    DB.insert
}

function importLocationData(data, parent, level) {
    data.forEach(function(loc, index) {
        DB.insert(Location, {name: loc.name, descr: '', locLevel: level, parentId: parent.id, displayOrder: (index + 1)}, (id) => {
            if (loc.data && loc.data.length) importLocationData(loc.data, {id: id}, level + 10);
        });
    });
}

(function() {
    initDb().then(importData);
}());