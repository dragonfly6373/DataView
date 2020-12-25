const {DB} = require("../lib/db");
var DataType = DB.DataType;

var Status = {
    ACTIVE:   {code: 10, name: "Active"},
    PENDDING: {code: 20, name: "Pendding"},
    SUSPEND:  {code: 30, name: "Suspend"}
};

var Gender = {
    FEMALE: {code: 0, name: "Female"},
    MALE:   {code: 1, name: "Male"},
    OTHER:  {cod: 2, name: "Other"}
};

module.exports = {
    tablename:"account",
    datafields: {
        id: {mapping: "rowid", datatype: "INT", pk: true},
        name: {datatype: "TEXT"},
        email: {datatype: "TEXT"},
        sex: {datatype: "INT"},
        phone: {datatype: "TEXT"},
        password: {datatype: "TEXT", dbignore: true, visible: false},
        createdDate: {mapping: "created_date", datatype: "DateTime"},
        status: {datatype: "INT"},
        deleted: {datatype: "INT"}
    },
    Status: Status,
    Gender: Gender
};
