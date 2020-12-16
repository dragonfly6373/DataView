const {DB} = require("../lib/db");
var DataType = DB.DataType;

var StoreStatus = {
    ACTIVE: {code: 10, name: "Active"},
    PENDDING: {code: 20, name: "Pendding"},
    SUSPEND: {code: 30, name: "Suspend"},
    CLOSED: {code: 40, name: "Closed"},
    DELETED: {code: 50, name: "Deleted"}
};

module.exports = {
    tablename:"store",
    datafields: {
        id: {mapping: "rowid", datatype: DataType.INT, pk: true},
        accountId: {mapping: "account_id", datatype: DataType.INT},
        createdDate: {mapping: "created_date", datatype: DataType.DATETIME},
        name: {datatype: DataType.TEXT},
        address: {datatype: DataType.TEXT},
        phone: {datatype: DataType.TEXT},
        status: {datatype: DataType.INT}
    },
    StoreStatus: StoreStatus
};
