const {DB} = require("../lib/db");
var DataType = DB.DataType;

var AccountStatus = {
    ACTIVE: {code: 10, name: "Active"},
    PENDDING: {code: 20, name: "Pendding"},
    SUSPEND: {code: 30, name: "Suspend"}
};

module.exports = {
    tablename:"account",
    datafields: {
        id: {mapping: "rowid", datatype: "INT", pk: true},
        name: {datatype: "TEXT"},
        email: {datatype: "TEXT"},
        sex: {datatype: "INT"},
        phone: {datatype: "TEXT"},
        password: {datatype: "TEXT", ignore: true},
        createdDate: {mapping: "created_date", datatype: "DateTime"},
        status: {datatype: "INT"},
        deleted: {datatype: "INT"}
    },
    AccountStatus: AccountStatus
};