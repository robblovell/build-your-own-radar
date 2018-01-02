"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sheetNotFoundError_1 = require("../../src/exceptions/sheetNotFoundError");
var exceptionMessages_1 = require("./exceptionMessages");
var Sheet = /** @class */ (function () {
    function Sheet(sheetReference) {
        this.sheetReference = {};
        this.id = 0;
        this.sheetReference = sheetReference;
        var matches = this.sheetReference.match("https:\\/\\/docs.google.com\\/spreadsheets\\/d\\/(.*?)($|\\/$|\\/.*|\\?.*)");
        this.id = matches !== null ? matches[1] : this.sheetReference;
    }
    Sheet.prototype.exists = function (callback) {
        var feedURL = "https://spreadsheets.google.com/feeds/worksheets/" + this.id + "/public/basic?alt=json";
        // TODO: Move this out (as HTTPClient)
        var xhr = new XMLHttpRequest();
        xhr.open('GET', feedURL, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    return callback();
                }
                else {
                    return callback(new sheetNotFoundError_1.default(exceptionMessages_1.default.SHEET_NOT_FOUND));
                }
            }
        };
        xhr.send(null);
    };
    ;
    return Sheet;
}());
exports.default = Sheet;
//# sourceMappingURL=sheet.js.map