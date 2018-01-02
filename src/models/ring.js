"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ring = /** @class */ (function () {
    function Ring(name, order) {
        if (name === void 0) { name = ""; }
        if (order === void 0) { order = 1; }
        this.aname = name;
        this.aorder = order;
    }
    Ring.prototype.name = function () {
        return this.aname;
    };
    ;
    Ring.prototype.order = function () {
        return this.aorder;
    };
    ;
    return Ring;
}());
exports.default = Ring;
//# sourceMappingURL=ring.js.map