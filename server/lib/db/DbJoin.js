function DbJoin() {
    this.joinType = "";
    this.model = null;
    this.alias = "";
    this.condition = [];
}
DbJoin.JoinType = {
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    INNER: "INNER",
    OUTER: "OUTTER"
}

DbJoin.prototype.ON = function(condition) {
    this.condition = condition;
    return this;
};

DbJoin.prototype.toString = function() {
    return " " + this.joinType + " " + this.model.tablename + " ON " + this.condition.build();
};

function createJoin(joinType) {
    var dbjoin = new DbJoin();
    dbjoin.joinType = joinType;
    return (function(model, alias) {
            this.model = model;
            this.alias = alias;
            return this;
        }).bind(dbjoin);
}

module.exports = {
    LEFT: createJoin(DbJoin.LEFT),
    RIGHT: createJoin(DbJoin.RIGHT),
    OUTTER: createJoin(DbJoin.OUTTER),
    INNER: createJoin(DbJoin.INNER)
};
