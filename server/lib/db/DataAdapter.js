/**
 * Document URL: https://github.com/mapbox/node-sqlite3/wiki/API
 */
var sqlite3 = require('sqlite3');

var DataAdapter = (function() {
    var DB_NAME = "./data.db";
    var DataType = {
        INT:        { code: 1, sql_type: "INTEGER" },
        INTEGER:    { code: 2, sql_type: "INTEGER" },
        TEXT:       { code: 3, sql_type: "TEXT" },
        BLOB:       { code: 4, sql_type: "BLOB" },
        REAL:       { code: 5, sql_type: "REAL" },
        DOUBLE:     { code: 6, sql_type: "REAL" },
        FLOAT:      { code: 7, sql_type: "REAL" },
        BOOLEAN:    { code: 8, sql_type: "INTEGER" },
        DATETIME:   { code: 9, sql_type: "INTEGER" }
    };
    function setupDb(options) {
        if (!options) return;
        DB_NAME = options.dbname || DB_NAME;
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
        console.log("getDataTypeName:", code);
        var type = DataType[code.toUpperCase()];
        if (!type) return DataType.INT.sql_type;
        return type.sql_type;
    }
    function convertDataByType(value, datatype) {
        var type = (datatype instanceof Object ? datatype : DataType[datatype.toUpperCase()]);
        switch(type) {
            case DataType.INT:
            case DataType.REAL:
            case DataType.NUMERIC:
                return value ? value : 0;
            case DataType.TEXT:
            case DataType.BLOB:
                return "'" + value + "'";
            case DataType.DateTime:
                return value.getTime();
            default:
                return value ? value : 0;
        }
    }
    function mappingDb2Model(data, clazz) {
        return Object.keys(clazz.datafields).reduce(function(a, c) {
            var f = clazz.datafields[c];
            var k = f.mapping || c;
            a[c] = data[k];
            return a;
        }, {});
    }
    function mappingModel2Db(data, clazz) {
        return Object.keys(data).reduce(function(a, k) {
            var f = clazz.datafields;
            if (f) {
                if (f.mapping) a[f.mapping] = data[k];
                else a[k] = data[k];
            }
            return a;
        }, {});
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
    DB.prototype.dropTable = function(clazz, callback) {
        var thiz = this;
        var sql = "DROP TABLE IF EXISTS " + clazz.tablename;
        try {
            console.log("[DB - Execute: ", sql);
            if (!this.db) this.db = getConnection();
            this.db.run(sql, [], function(error) {
                if (!thiz._isError(error) && callback) callback();
            });
        } catch(error) {
            this._onError(error);
        } finally {
            if (this.transactional) return;
            this.close();
        }
    };
    DB.prototype.create = function(clazz, options, callback) {
        var thiz = this;
        var columns = Object.keys(clazz.datafields).filter(f => {
                f = clazz.datafields[f].mapping || f;
                if (f == "rowid") return false;
                return true;
            }).map(c => {
                var f = clazz.datafields[c];
                console.log(" - field: ", f);
                var s = (f.mapping || c) + " "
                    + (f.datatype instanceof Object ? f.datatype.sql_type : getDataTypeName(f.datatype))
                    + (f.pk ? " PRIMARY KEY" : "")
                    + (f.unique ? " UNIQUE" : "");
                return s;
            });
        var sql = "CREATE TABLE IF NOT EXISTS "
                + clazz.tablename + "(" + columns.join(", ") + ")"
                + (options && options.withoutrowid ? "WITHOUT ROWID" : "");
        try {
            if (!this.db) this.db = getConnection();
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
        var columns = Object.keys(clazz.datafields).filter(c => !clazz.datafields[c].pk);
        var values = [];
        var fields = [];
        columns.forEach(c => {
            var f = clazz.datafields[c];
            values.push(convertDataByType(object[c], f.datatype));
            fields.push((f.mapping || c));
        });
        var sql = "INSERT INTO {0} ({1}) VALUES({2})".format(clazz.tablename, fields.join(","), values.map(f => "?").join(","));
        try {
            console.log("[DB - CREATE]:", sql);
            this.db.run(sql, values, function(error) {
                if (!thiz._isError(error) && callback) callback(thiz.db.lastID);
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
        data = mappingModel2Db(data, clazz);
        var thiz = this;
        if (!this.db) this.db = getConnection();
        var setStr = Object.keys(data).map((key) => {
            console.log(" . ", key);
            return (key + " = ?");
        }).join(", ");
        var sql = "UPDATE " + clazz.tablename + " SET " + setStr + " " + (condition ? condition.toString() : "");
        try {
            console.log("# update string: ", sql, Object.values(data));
            this.db.run(sql, Object.values(data),
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
        var sql = "DELETE FROM " + clazz.tablename + " " + Condition.eq("id", id).toString();
        try {
            if (!this.db) this.db = getConnection();
            this.db.run(sql, function(error) {
                    if (!thiz._isError(error) && callback) callback();
                });
        } catch(error) {
            this._onError(error);
        } finally {
            if (this.transactional) return;
            this.close();
        }
    };
    DB.prototype.batchDelete = function(clazz, condition, callback) {
        console.log("[DB - Batch Delete]:");
        var thiz = this;
        var sql = "DELETE FROM " + clazz.tablename + " " + condition.toString();
        try {
            if (!this.db) this.db = getConnection();
            this.db.run(sql,
                function(error) {
                    if (!thiz._isError(error) && callback) callback();
                });
        } catch(error) {
            this._onError(error);
        } finally {
            this.db.close();
        }
    };
    DB.prototype.getAll = function(clazz, condition, orders, callback) {
        var thiz = this;
        var sql = "SELECT rowid, * FROM " + clazz.tablename
                + (condition ? " " + condition.toString() : "")
                + (orders ? " " + orders.toString() : "");
        console.log("[DB - GET ALL]:", sql);
        try {
            if (!this.db) this.db = getConnection();
            this.db.all(sql, function(error, data) {
                if (!thiz._isError(error) && callback) callback(data.map((d) => mappingDb2Model(d, clazz)));
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
        var sql = "SELECT " + clazz.withoutrowid ? "" : "rowid, "
                + "* FROM $tablename WHERE "
                + (clazz.withoutrowid ? "id" : "rowid") + " = $id";
        try {
            if (!this.db) this.db = getConnection();
            this.db.get(sql, {$tablename: clazz.tablename, $id: id}, function(error, data) {
                if (!this._isError(error) && callback) {
                    var result = data.map((d) => {
                        return mappingDb2Model(d, clazz);
                    });
                    callback(result);
                }
            });
        } catch(error) {
            this._onError(error);
        } finally {
            if (this.transactional) return;
            this.db.close();
        }
    };
    DB.prototype.query = function(clazz, condition, orders, offset, count, callback) {
        console.log("Query by condition: ", clazz.tablename, condition);
        try {
            if (!this.db) this.db = getConnection();
            this.beginTransaction(function(pool) {
                pool.count(clazz, condition, function(total) {
                    if (total == 0 && callback) {
                        callback({count: 0, data: []});
                        return;
                    }
                    var sql = "SELECT " + (clazz.withoutrowid ? "" : "rowid, ") + "* FROM " + clazz.tablename
                            + (condition ? " " + condition.toString() : "")
                            + (orders ? " " + orders.toString() : "")
                            + " LIMIT " + count + " OFFSET " + offset;
                    console.log("[DB - QUERY]:", sql);
                    pool.db.all(sql, function(error, data) {
                        if (!pool._isError(error) && callback) callback({count: total, data: data.map((d) => mappingDb2Model(d, clazz))});
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
            setupDb(options);
        },
        beginTransaction: function(callback) {
            new DB(getConnection()).beginTransaction(calback);
        },
        create: function() {
            var clazz = arguments[0];
            var forceDrop = arguments.length > 2 ? arguments[1] : false;
            var callback = arguments[arguments.length - 1];
            if (!forceDrop) new DB(getConnection()).create(clazz, null, callback);
            else {
                new DB(getConnection()).beginTransaction(function(pool) {
                    pool.dropTable(clazz, function() {
                        pool.create(clazz, null, function() {
                            callback();
                            pool.close();
                        });
                    });
                });
            }
        },
        createIfNotExists: function(clazz, callback) {
            new DB(getConnection()).create(clazz, {if_not_exists: true}, callback);
        },
        createOrReplace: function(clazz, callback) {
            new DB(getConnection()).beginTransaction(function(pool) {
                pool.dropTable(clazz, function() {
                    pool.create(clazz, null, function() {
                        callback();
                        pool.close();
                    });
                });
            });
        },
        insert: function(clazz, object, callback) {
            new DB(getConnection()).insert(clazz, object, callback);
        },
        insertMulti: function(clazz, list, callback) {
            new DB(getConnection()).insertMulti(clazz, list, callback);
        },
        update: function(clazz, data, callback) {
            new DB(getConnection()).update(clazz, data, Condition.eq("id", data.id), callback);
        },
        deleteById: function(clazz, id, callback) {
            new DB(getConnection()).deleteById(clazz, id, callback);
        },
        batchUpdate: function(clazz, values, condition, callback) {
            new DB(getConnection()).update(clazz, values, condition, callback);
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
        query: function(clazz, condition, orders, offset, count, callback) {
            new DB(getConnection()).query(clazz, condition, orders, offset, count, callback);
        },
        DataType: DataType
    }
})();

module.exports = DataAdapter;
