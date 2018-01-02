"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ring = function (name, order) {
    var self = {};
    self.name = function () {
        return name;
    };
    self.order = function () {
        return order;
    };
    return self;
};
exports.default = Ring;
