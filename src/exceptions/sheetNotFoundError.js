"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SheetNotFoundError = function (message) {
    this.message = message;
};
Object.setPrototypeOf(SheetNotFoundError, Error);
SheetNotFoundError.prototype = Object.create(Error.prototype);
SheetNotFoundError.prototype.name = "SheetNotFoundError";
SheetNotFoundError.prototype.message = "";
SheetNotFoundError.prototype.constructor = SheetNotFoundError;
exports.default = SheetNotFoundError;
//# sourceMappingURL=sheetNotFoundError.js.map