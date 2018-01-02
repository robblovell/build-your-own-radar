"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MalformedDataError = function (message) {
    this.message = message;
};
Object.setPrototypeOf(MalformedDataError, Error);
MalformedDataError.prototype = Object.create(Error.prototype);
MalformedDataError.prototype.name = "MalformedDataError";
MalformedDataError.prototype.message = "";
MalformedDataError.prototype.constructor = MalformedDataError;
exports.default = MalformedDataError;
