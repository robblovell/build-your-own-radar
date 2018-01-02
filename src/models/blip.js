"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IDEAL_BLIP_WIDTH = 22;
var Blip = /** @class */ (function () {
    function Blip(name, ring, isNew, topic, description) {
        this.width = IDEAL_BLIP_WIDTH;
        this._number = -1;
        this._name = "";
        this._isNew = false;
        this._topic = "";
        this._description = "";
        this._name = name;
        this._isNew = isNew;
        this._topic = topic;
        this._description = description;
        this._ring = ring;
    }
    Blip.prototype.name = function () {
        return this._name;
    };
    ;
    Blip.prototype.topic = function () {
        return this._topic || '';
    };
    ;
    Blip.prototype.description = function () {
        return this._description || '';
    };
    ;
    Blip.prototype.isNew = function () {
        return this._isNew;
    };
    ;
    Blip.prototype.ring = function () {
        return this._ring;
    };
    ;
    Blip.prototype.number = function () {
        return this._number;
    };
    ;
    Blip.prototype.setNumber = function (newNumber) {
        this._number = newNumber;
    };
    ;
    return Blip;
}());
exports.default = Blip;
//# sourceMappingURL=blip.js.map