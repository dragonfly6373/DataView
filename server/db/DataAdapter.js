/**
 * Document URL: https://github.com/mapbox/node-sqlite3/wiki/API
 */
var sqlite3 = require('sqlite3');

var DataAdapter = (function() {
    var DB_NAME;
    var DataType = { INT: 1, TEXT: 2, BLOB: 3, REAL: 4, NUMERIC: 5 };
    function setupDb(dbName) {
        DB_NAME = dbName;
    }
    function getConnection() {
        console.log("try to connect db:", DB_NAME);
        return new sqlite3.Database(DB_NAME, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
    }
    function convertDataByType(value, datatype) {
        switch(datatype) {
            case DataType.INT:
            case DataType.REAL:
            case DataType.NUMERIC:
                return value ? value : 0;
            case DataType.TEXT:
            case DataType.BLOB:
                return "'" + value + "'";
            default:
                return value ? value : 0;
        }
    }
    function DB(connection) {
        this.db = connection;
        this.transactional = false;
    }
    DB.prototype.beginTransaction = function(callback) {
        if (!this.db) this.db = getConnection();
        console.log("[DB - Begin Transaction]");
        this.db.exec("BEGIN", function(error) {
            if (error) console.log("[ERROR]", error);
            if (callback) callback();
        });
        // db.exec("ROLLBACK");
        // db.exec("COMMIT");
    };
    DB.prototype.commit = function() {
        if (this.db) this.db.exec("COMMIT");
    };
    DB.prototype.create = function(clazz, callback) {
        console.log("Create:", clazz.tablename, data);
        if (!this.db) this.db = getConnection();
        var sql = String.format("CREATE TABLE {0} ({1})", clazz.tablename, clazz.columns.map(col => {
            return col.name + " " + col.datatype + (col.pk ? " PRIMARY KEY" : "") + (col.unique ? " UNIQUE" : "");
        }).join(", "));
        console.log("[DB - Execute]:", sql);
        try {
            this.db.run(sql, [], function(output) {
                if (callback) callback(output);
            });
        } catch(error) {
            console.log("[ERROR]", error);
            if (this.transactional) this.db.exec("ROLLBACK");
        } finally {
            if (this.transactional) return;
            this.db.close()
        }
    }
    DB.prototype.insert = function(clazz, object, callback) {
        if (!this.db) this.db = getConnection();
        var data = [];
        clazz.columns.map(col => {
            return convertDataByType(object[col.name], col.datatype);
        }).join(",");
        var sql = String.format("INSERT INTO {0} ({1}) VALUES({2})", clazz.tablename, clazz.columns.map((col) => col.name).join(","), values);
        console.log("[DB - CREATE]:", sql);
        try {
            this.db.run(sql, data, function(output) {
                    if (callback) callback(output);
                }
            );
        } catch(error) {
            console.log("[ERROR]", error);
            if (this.transactional) this.db.exec("ROLLBACK");
        } finally {
            if (this.transactional) return;
            this.db.close();
        }
    };
    DB.prototype.insertMulti = function(clazz, list, callback) {
        console.log("Insert Multi:", clazz.tablename, data);
    };
    DB.prototype.update = function(clazz, data, condition, callback) {
        console.log("Update:", clazz.tablename, data);
        var conn = getConnection();
        var values = Object.keys(data).forEach((key) => {

        });
        var sql = String.format("UPDATE {0} SET {1} {2}", clazz.tablename, values, condition.toString());
        // conn.run("UPDATE ...");
    };
    DB.prototype.deleteById = function(clazz, id, callback) {
        console.log("Delete:", clazz.tablename, id);
        var conn = getConnection();
        // conn.run("DELETE ...");
    };
    DB.prototype.batchDelete = function(clazz, condition, callback) {
        console.log("[DB - Batch Delete]:");
    };
    DB.prototype.getAll = function(clazz, condition, orders, callback) {
        console.log("Get all:", clazz.tablename, (condition ? " with condition " + condition.build() : ""));
        if (!this.db) this.db = getConnection();
        var sql = String.format("SELECT {0} FROM {1} {2}",
                    "rowid oid, " + clazz.columns.map((col)=> col.name).join(),
                    clazz.tablename,
                    condition ? condition.toString() : "");
        console.log("### SQL:", sql);
        try {
            db.all("SELECT * FROM $tablename $where", [], function(err, result) {
                console.log("### getAll:", err, result);
                if (!err) callback(result);
            });
        } catch(error) {
            console.log("[SQL - ERROR]", error);
        } finally {
            if (this.transactional) return;
            this.db.close();
        }
    };
    DB.prototype.count = function(clazz, condition, callback) {
            var sql = "";
            console.log("[DB - COUNT]:", sql);
        };
    DB.prototype.getById = function(clazz, id, callback) {
        console.log("Get by Id:", clazz.tablename, id);
        if (!this.db) this.db = getConnection();
        try {
            this.db.get("SELECT * FROM $tablename WHERE id = $id", {$tablename: clazz.tablename, $id: id}, callback);
        } catch(error) {
            console.log("[ERROR]", error);
            if (this.transactional) this.db.exec("ROLLBACK");
        } finally {
            if (this.transactional) return;
            this.db.close();
        }
    };
    DB.prototype.query = function(clazz, condition, offset, count, orders, callback) {
        console.log("Query by condition: ", clazz.tablename, condition);
        if (!this.db) this.db = getConnection();
        try {
            this.db.all("SELECT * FROM $tablename $where $order LIMIT $count OFFSET $offset",
                {
                    $where: condition.toString(), $order: (orders ? "ORDER BY" + orders.toString() : ""),
                    $count: count, $offset: offset
                },
                function(data) {
                    if (callback) callback(data);
                });
        } catch(error) {
            console.log("[ERROR]", error);
            if (this.transactional) this.db.exec("ROLLBACK");
        } finally {
            if (this.transactional) return;
            this.db.close();
        }
    };
    return {
        config: function(options, callback) {
            setupDb(options.path || "./data.db");
        },
        beginTransaction: function(callback) {
            new DB(getConnection()).beginTransaction(calback);
        },
        create: function(clazz, callback) {
            new DB(getConnection()).create(clazz, callback);
        },
        insert: function(clazz, object, callback) {
            new DB(getConnection()).insert(clazz, object, callback);
        },
        insertMulti: function(clazz, list, callback) {
            new DB(getConnection()).insertMulti(clazz, list, callback);
        },
        update: function(clazz, data, condition, callback) {
            new DB(getConnection()).update(clazz, data, condition, callback);
        },
        deleteById: function(clazz, id, callback) {
            new DB(getConnection()).deleteById(clazz, id, callback);
        },
        batchDelete: function(clazz, condition, callback) {
            new DB(getConnection()).batchDelete(clazz, condition, callback);
        },
        getAll: function(clazz, condition, orders, callback) {
            new DB(getConnection()).getAll(clazz, condition, orders, callback);
        },
        count: function(clazz, condition, callback) {
            new DB(getConnection()).count(clazz, condition, callback);
        },
        getById: function(clazz, id, callback) {
            new DB(getConnection()).getById(clazz, id, callback);
        },
        query: function(clazz, condition, offset, count, orders, callback) {
            new DB(getConnection()).query(clazz, condition, offset, count, orders, callback);
        },
        DataType: DataType
    }
})();

module.exports = DataAdapter;
