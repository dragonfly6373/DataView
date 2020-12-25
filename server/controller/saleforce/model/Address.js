const {DB, DbJoin, Condition} = require("db");
const {Location} = require("model");

var Address = {
    tablename: "location",
    joins: [
        DbJoin.leftJoin(Location, "d").on(Condition.eqProperty("parent_id", "d.rowid")),
        DbJoin.leftJoin(Location, "p").on(Condition.eqProperty("parent_id", "p.rowid").setContext({alias: "d"}))
    ],
    datafields: {
        id: {mapping: "rowid", datatype: "TEXT"},
        ward: {mapping: "name", datatype: "TEXT"},
        district: {formular: "d.name", alias: "district", datatype: "TEXT"},
        province: {formular: "p.name", alias: "privince", datatype: "TEXT"}
    }
}

module.exports = Address;
