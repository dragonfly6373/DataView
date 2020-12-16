const {DB} = require("../lib/db");
var DataType = DB.DataType;

var MemberStatus = {
    ACTIVE: {code: 10, name: "Active"},
    PENDDING: {code: 20, name: "Pendding"},
    SUSPEND: {code: 30, name: "Suspend"}
};

module.exports = {
    tablename:"member",
    datafields: {
        id: {mapping: "rowid", datatype: "INT", pk: true},
        accountId: {mapping: "account_id", datatype: "INT"},
        createdDate: {mapping: "created_date", datatype: "DateTime"},
        name: {datatype: "TEXT"},
        email: {datatype: "TEXT"},
        sex: {datatype: "INT"},
        status: {datatype: "INT"},
        deleted: {datatype: "INT"}
    },
    MemberStatus: MemberStatus
};
