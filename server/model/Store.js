const {DB} = require("../lib/db");
var DataType = DB.DataType;

const Account = require("./Account");
const Location = require("./Location");

var StoreStatus = {
    ACTIVE: {code: 10, name: "Active"},
    PENDDING: {code: 20, name: "Pendding"},
    SUSPEND: {code: 30, name: "Suspend"},
    CLOSED: {code: 40, name: "Closed"}
};

var Store = {
    tablename:"store",
    datafields: {
        id: {mapping: "rowid", datatype: DataType.INT, pk: true},
        accountId: {mapping: "account_id", datatype: DataType.INT},
        parentId: {mapping: "parent_id", datatype: DataType.INT},
        createdDate: {mapping: "created_date", datatype: DataType.DATETIME},
        name: {datatype: DataType.TEXT},
        locationId: {mapping: "location_id", datatype: DataType.INT},
        address: {datatype: DataType.TEXT},
        phone: {datatype: DataType.TEXT},
        status: {datatype: DataType.INT},
        deleted: {datatype: DataType.INT}
    },
    StoreStatus: StoreStatus
};
Store.constraints = [
    {fk: "account_id", ref: {table: Account, column: "rowid"}},
    {fk: "parent_id", ref: {table: Store, column: "rowid"}},
    {fk: "location_id", ref: {table: Location, column: "rowid"}}
];

module.exports = Store;
