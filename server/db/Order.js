function Order(fieldname, asc, ignorecase, nullside) {
    this.fieldname = fieldname;
    this.asc = asc;
    this.ignorecase = ignorecase;
    this.nullside = nullside;
    this.next = null;
}

Order.prototype.asc = function(fieldname, ignorecase, nullside) {
    if (!this.next) this.next = new Order(fieldname, true, ignorecase, nullside);
    else this.next.asc.apply(this.next, arguments);
};

Order.prototype.desc = function(fieldname, ignorecase, nullside) {
    if (!this.next) this.next = new Order(fieldname, false, ignorecase, nullside);
    else this.next.desc.apply(this.next, arguments);
};

Order.prototype.build = function() {
    var str = "";
    str += (this.ignorecase ? " LOWER(" + this.fieldname + ")" : this.fieldname);
    str += (this.asc ? " ASC" : " DESC");
    str += (this.nullside != null ? (this.nullside ? " FIRST" : " LAST") : "");
    if (this.next) str += ", " + this.next.build();
    return str;
};

Order.prototype.toString = function() {
    return "ORDER BY " + this.build();
};

Order.__proto__ = {
    asc: function(fieldname, ignorecase, nullside) {
        return new Order(fieldname, true, ignorecase, nullside);
    },
    desc: function(fieldname, ignorecase, nullside) {
        return new Order(fieldname, false, ignorecase, nullside);
    }
};

module.exports = Order;
