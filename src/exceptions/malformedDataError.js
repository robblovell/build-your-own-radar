"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MalformedDataError = /** @class */ (function () {
    function MalformedDataError(message) {
        this.message = "";
        this.message = message;
    }
    return MalformedDataError;
}());
// const MalformedDataError = function(message:any):void {
//   this.message=message;
// };
// (<any>Object).setPrototypeOf(MalformedDataError, Error);
// MalformedDataError.prototype = Object.create(Error.prototype);
// MalformedDataError.prototype.name = "MalformedDataError";
// MalformedDataError.prototype.message = "";
// MalformedDataError.prototype.constructor = MalformedDataError;
exports.default = MalformedDataError;
//# sourceMappingURL=malformedDataError.js.map