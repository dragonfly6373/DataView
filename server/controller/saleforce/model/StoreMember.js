const {DB} = require("db");
var DataType = DB.DataType;

const {Store, Member} = require("model");

var Status = {
    ACTIVE: {code: 10, name: "Active"},
    PENDDING: {code: 20, name: "Pendding"},
    SUSPEND: {code: 30, name: "Suspend"}
};
var Grade = {
    NEW: {code: 10, name: "New Member"},
    SILVER: {code: 20, name: "Silver"},
    GOLD: {code: 30, name: "Gold"},
    DIAMON: {code: 40: name: "Diamon"}
};

module.exports = {
    tablename:"store_member",
    datafields: {
        id: {mapping: "rowid", datatype: DataType.INT, pk: true},
        storeId: {mapping: "account_id", datatype: DataType.INT},
        memberId: {mapping: "member_id", datatype: DataType.INT}
        joinedDate: {mapping: "joined_date", datatype: DataType.DATETIME},
        grade: {datatype: DataType.INT},
        status: {datatype: DataType.INT},
        deleted: {datatype: DataType.INT}
    },
    constrains: [
        {fk: "store_id", ref: {table: Store, column: "rowid"}},
        {fk: "member_id", ref: {table: Member, column: "rowid"}}
    ],
    Status: Status,
    Grade: Grade
};
