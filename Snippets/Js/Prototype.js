/*
 * Prototype.js
 * Copyright (C) 2014 ronan <ronan@cider.local>
 *
 * Distributed under terms of the MIT license.
 */

function Apple (type) {
    this.type = type;
    this.color = "red";
}

Apple.prototype.getInfo = function() {
    return this.color + ' ' + this.type + ' apple';
};
