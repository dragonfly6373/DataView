
var Condition = function(queryStr) {
    this.query = queryStr;
    this.queue = [];
};

Condition.prototype = {
    and: function(condition) {
        this.queue.push({operator: " AND", condition: condition});
        return this;
    },
    or: function(condition) {
        this.queue.push({operator: " OR", condition: condition});
        return this;
    }
}

Condition.prototype.toString = function() {
    return " WHERE" + this.build();
}

Condition.prototype.build = function() {
    var queryStr = this.query;
    for (var i in this.queue) {
        var opt = this.queue[i];
        queryStr += " " + opt.operator + (opt.condition.queue.length ? " (" + opt.condition.build() + ")" : " " + opt.condition.build());
    }
    return queryStr;
}

Condition.__proto__ = function() {
    function isolateDataType(data) {
        return typeof(data) != "number" ? "'" + data + "'" : data;
    }
    return {
        eq: function(name, value) {
            return new Condition(" " + name + " = " + isolateDataType(value));
        },
        ne: function(name, value) {
            return new Condition(" " + name + " != " + isolateDataType(value));
        },
        gt: function(name, value) {
            return new Condition(" " + name + " > " + isolateDataType(value));
        },
        gte: function(name, value) {
            return new Condition(" " + name + " >= " + isolateDataType(value));
        },
        lt: function(name, value) {
            return new Condition(" " + name + " < " + isolateDataType(value));
        },
        lte: function(name, value) {
            return new Condition(" " + name + " <= " + isolateDataType(value));
        },
        in: function(name, args) {
            return new Condition(" " + name + " IN (" + args.map((item) => isolateDataType(item)).join(", ") + ")");
        },
        between: function(name, start, end) {
            return new Condition(" " + name + " BETWEEN (" + isolateDataType(start) + ", " + isolateDataType(end) + ")");
        },
        isNull: function(name) {
            return new Condition(" " + name + " IS NULL");
        },
        isNotNull: function(name) {
            return new Condition(" " + name + " IS NOT NULL");
        },
        iLike: function(name, value) {
            return new Condition(" " + name + " LIKE '%" + value + "%'");
        }
    }
}();
