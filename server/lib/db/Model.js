const DB = require("./DataAdapter");
const Condition = require("./Condition");
const DbJoin = require("./DbJoin");

var DataType = DB.DataType;


var AccountStatus = {
    ACTIVE: {code: 10, name: "Active"},
    PENDDING: {code: 20, name: "Pendding"},
    SUSPEND: {code: 30, name: "Suspend"}
};

var Account = {
    tablename:"account",
    datafields: {
        id: {mapping: "rowid", datatype: "INT", pk: true},
        name: {datatype: "TEXT"},
        email: {datatype: "TEXT"},
        sex: {datatype: "INT"},
        createdDate: {mapping: "created_date", datatype: "DateTime"},
        status: {datatype: "INT"},
        deleted: {datatype: "INT"}
    },
    AccountStatus: AccountStatus
};
var StoreStatus = {
    ACTIVE: {code: 10, name: "Active"},
    PENDDING: {code: 20, name: "Pendding"},
    SUSPEND: {code: 30, name: "Suspend"},
    CLOSED: {code: 40, name: "Closed"},
    DELETED: {code: 50, name: "Deleted"}
};

var Store = {
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
    constraints: [
        {
            fk: "account_id", ref: {table: Account, column: "rowid"}
        }
    ],
    StoreStatus: StoreStatus
};

var AdminType = {
    ADMIN: {code: 10, name: "Admin", text: "Store Admin"},
    INVENTORY: {code: 20, name: "Inventory", text: "Inventory"},
    SALE: {code: 30, name: "Sale", text: "Sale"}
};

var StoreAccountSetting = {
    tablename:"store_account_setting",
    datafields: {
        id: {mapping: "rowid", datatype: DataType.INT, pk: true},
        accountId: {mapping: "account_id", datatype: DataType.INT},
        storeId: {mapping: "store_id", datatype: DataType.INT},
        adminType: {mapping: "admin_type", datatype: DataType.INT},
        createdDate: {mapping: "created_date", datatype: DataType.DATETIME},
        status: {datatype: DataType.INT},
        deleted: {datatype: DataType.INT}
    },
    constraints: [
        {
            pk: ["accountId", "storeId"],
            ref: [
                {table: Account, column: "rowid"},
                {table: Store, column: "rowid"}
            ]
        }
    ],
    AdminType: AdminType
};

var StoreAccountView = {
    tablename:"store_account_setting",
    joins: [
        DbJoin.leftJoin(Account, "acc").on(Condition.eqProperty("account_id", "acc.rowid")),
        DbJoin.leftJoin(Store, "store").on(Condition.eqProperty("store_id", "store.rowid"))
    ],
    datafields: {
        ...StoreAccountSetting.datafields,
        accountName: {formular: "acc.name", alias: "account_name", datatype: DataType.TEXT},
        storeName: {formular: "store.name", alias: "store_name", datatype: DataType.TEXT},
        storeAddress: {formular: "store.address", alias: "store_address", datatype: DataType.TEXT},
        storeStatus: {formular: "store.status", alias: "store_status", datatype: DataType.TEXT}
    },
    constraints: [
        {
            pk: ["account_id", "store_id"],
            ref: [
                {table: Account, column: "rowid"},
                {table: Store, column: "rowid"}
            ]
        }
    ],
    without_rowid: true
};

module.exports = {
    Account: Account,
    Store: Store,
    StoreAccountSetting: StoreAccountSetting,
    StoreAccountView: StoreAccountView
};
