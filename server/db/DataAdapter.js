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
    if (!String.prototype.format) String.prototype.format = function () {
        var a = this;
        for (var k in arguments) {
            a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
        }
        return a
    }
    function getDataTypeName(code) {
        for (k of Object.keys(DataType)) {
            if (DataType[k] == code) return k;
        }
        return null;
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
    function object2DBKeys(obj) {
        var dataset = {};
        for (key of Object.keys(obj)) {
            dataset["$" + key] = obj[key];
        }
        return dataset;
    }
    function DB(connection) {
        this.db = connection;
        this.transactional = false;
    }
    DB.prototype._isError = function(error) {
        if (error) {
            this._onError(error);
            return true;
        }
        return false;
    };
    DB.prototype._onError = function(error) {
        console.log("[ERROR]", error);
        if (this.transactional) this.db.exec("ROLLBACK");
    };
    DB.prototype.beginTransaction = function(callback) {
        var thiz = this;
        this.transactional = true;
        if (!this.db) this.db = getConnection();
        try {
            console.log("[DB - Begin Transaction]");
            this.db.exec("BEGIN", function(error) {
                if (!thiz._isError(error) && callback) callback(thiz);
            });
            // db.exec("ROLLBACK");
            // db.exec("COMMIT");
        } catch(error) {
            this.close();
        }
    };
    DB.prototype.commit = function() {
        try {
            if (!this.db) return;
            console.log("[DB - End Transaction]");
            this.db.exec("COMMIT");
        } catch(error) {
            this._onError(error);
        } finally {
            this.close();
        }
    };
    DB.prototype.close = function() {
        this.db.close();
    };
    DB.prototype.create = function(clazz, callback) {
        var thiz = this;
        if (!this.db) this.db = getConnection();
        var columns = clazz.columns.map(col => {
            return col.name + " " + getDataTypeName(col.datatype) + (col.pk ? " PRIMARY KEY" : "") + (col.unique ? " UNIQUE" : "");
        }).join(", ");
        var sql = "CREATE TABLE {0} ({1})".format(clazz.tablename, columns);
        try {
            console.log("[DB - Execute]:", sql);
            this.db.run(sql, [], function(error) {
                if (!thiz._isError(error) && callback) callback();
            });
        } catch(error) {
            this._onError(error);
        } finally {
            if (this.transactional) return;
            this.close();
        }
    }
    DB.prototype.insert = function(clazz, object, callback) {
        var thiz = this;
        if (!this.db) this.db = getConnection();
        var values = clazz.columns.map(col => {
            return convertDataByType(object[col.name], col.datatype);
        }).join(",");
        var sql = "INSERT INTO {0} ({1}) VALUES({2})".format(clazz.tablename, clazz.columns.map((col) => col.name).join(","), values);
        try {
            console.log("[DB - CREATE]:", sql);
            this.db.run(sql, function(error) {
                if (!thiz._isError(error) && callback) callback(thiz.lastID);
            });
        } catch(error) {
            this._onError(error);
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
        var thiz = this;
        if (!this.db) this.db = getConnection();
        var setStr = Object.keys(data).map((key) => {
            return (key + " = $" + key);
        }).join(", ");
        try {
            this.db.run("UPDATE $tablename SET " + setStr + " $where",
                {$tablename: clazz.tablename, ...object2DBKeys(values), $where: condition.toString()},
                function(error) {
                    if (!thiz._isError(error) && callback) callback();
                });
        } catch(error) {
            this._onError(error);
        } finally {
            if (this.transactional) return;
            this.db.close();
        }
    };
    DB.prototype.deleteById = function(clazz, id, callback) {
        console.log("Delete:", clazz.tablename, id);
        var thiz = this;
        if (!this.db) this.db = getConnection();
        try {
            // this.db.run("DELETE ...");
        } catch(error) {
            this._onError(error);
        } finally {
            if (this.transactional) return;
            this.close();
        }
    };
    DB.prototype.batchDelete = function(clazz, condition, callback) {
        console.log("[DB - Batch Delete]:");
    };
    DB.prototype.getAll = function(clazz, condition, orders, callback) {
        console.log("Get all:", clazz.tablename, (condition ? " with condition " + condition.build() : ""));
        var thiz = this;
        if (!this.db) this.db = getConnection();
        var sql = "SELECT * FROM {0} {1} {2}";
        sql = sql.format(clazz.tablename, condition ? condition.toString() : "", orders ? order.toString() : "");
        console.log("### SQL:", sql);
        try {
            this.db.all(sql, function(error, result) {
                if (!thiz._isError(error) && callback) callback(result);
            });
        } catch(error) {
            this._onError(error);
        } finally {
            if (this.transactional) return;
            this.db.close();
        }
    };
    DB.prototype.count = function(clazz, condition, callback) {
        console.log("[DB - COUNT]:", sql);
        var thiz = this;
        if (!this.db) this.db = getConnection();
        var sql = "SELECT count(*) count FROM {0} {1}";
        sql = sql.format(clazz.tablename, condition ? condition.toString() : "");
        try {
            console.log("[DB - COUNT]:", sql);
            this.db.get(sql, function(error, data) {
                if (!thiz._isError(error) && callback) callback(data.count);
            });
        } catch(error) {
            this._onError(error);
        } finally {
            if (this.transactional) return;
            this.db.close();
        }
    };
    DB.prototype.getById = function(clazz, id, callback) {
        console.log("[DB - Get by Id]:", clazz.tablename, id);
        if (!this.db) this.db = getConnection();
        try {
            this.db.get("SELECT * FROM $tablename WHERE id = $id", {$tablename: clazz.tablename, $id: id}, function(error, data) {
                if (!this._isError(error) && callback) callback(data);
            });
        } catch(error) {
            this._onError(error);
        } finally {
            if (this.transactional) return;
            this.db.close();
        }
    };
    DB.prototype.query = function(clazz, condition, offset, count, orders, callback) {
        console.log("Query by condition: ", clazz.tablename, condition);
        if (!this.db) this.db = getConnection();
        try {
            this.beginTransaction(function(pool) {
                pool.count(clazz, condition, function(total) {
                    if (total == 0 && callback) {
                        callback({count: 0, data: []});
                        return;
                    }
                    var sql = "SELECT * FROM {0} {1} {2} LIMIT {3} OFFSET {4}";
                    sql = sql.format(clazz.tablename, condition ? condition.toString() : "", orders ? orders.toString() : "", count, offset);
                    console.log("[DB - QUERY]:", sql);
                    pool.db.all(sql, function(error, data) {
                        if (!pool._isError(error) && callback) callback({count: total, data: data});
                        pool.commit();
                    });
                });
            });
        } catch(error) {
            this._onError(error);
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
