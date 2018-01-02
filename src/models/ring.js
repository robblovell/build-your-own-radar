"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ring = /** @class */ (function () {
    function Ring(name, order) {
        this._name = "";
        this._order = 0;
        this._name = name;
        this._order = order;
    }
    Ring.prototype.name = function () {
        return this._name;
    };
    ;
    Ring.prototype.order = function () {
        return this._order;
    };
    ;
    return Ring;
}());
;
exports.default = Ring;
//# sourceMappingURL=ring.js.map