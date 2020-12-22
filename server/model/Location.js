const {DB} = require("../lib/db");
var DataType = DB.DataType;

var LocationLevel = {
    STATE: {code: 10, name: "State", title: "Province"},
    CITY: {code: 20, name: "City", title: "City"},
    DISTRICT: {code: 30, name: "District", title: "District"},
    WARD: {code: 40, name: "Ward", title: "Ward"}
};

var Location = {
    tablename: "location",
    datafields: {
        id: {mapping: "rowid", pk: true, datatype: DataType.INT},
        parentId: {mapping: "parent_id", datatype: DataType.INT},
        name: {datatype: DataType.TEXT},
        descr: {datatype: DataType.TEXT},
        locLevel: {mapping: "loc_level", datatype: DataType.INT},
        displayOrder: {mapping: "display_order", datatype: DataType.INT}
    },
    LocationLevel: LocationLevel
};

Location.constraints = [
    {fk: "parent_id", ref: {table: Location, column: "rowid"}}
];

module.exports = Location;
