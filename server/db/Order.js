function Order(fieldname, asc, ignorecase, nullside) {
    this.fieldname = fieldname;
    this.asc = asc;
    this.ignorecase = ignorecase;
    this.nullside = nullside;
    this.next = null;
}

Order.prototype.asc = function(fieldname, ignorecase, nullside) {
    this.next = new Order(fieldname, true, ignorecase, nullside);
};

Order.prototype.desc = function(fieldname, ignorecase, nullside) {
    this.next = new Order(fieldname, false, ignorecase, nullside);
};

Order.prototype.build = function() {
    var str = "";
    str += (this.ignorecase ? " LOWER(" + this.fieldname + ")" : this.fieldname);
    str += this.asc ? " ASC" : " DESC";
    str += this.nullside ? " FIRST" : " LAST";
    if (this.next) str += ", " + this.next.build();
};

Order.prototype.toString = function() {
    return "ORDER BY " + this.build();
};

Order.__proto__ = {
    asc: function(fieldname, ignorecase) {
        return new Order(fieldname, true, ignorecase, nullside);
    },
    desc: function() {
        return new Order(fieldname, false, ignorecase, nullside);
    }
};
