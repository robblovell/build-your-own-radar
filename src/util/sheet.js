"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sheetNotFoundError_1 = require("../../src/exceptions/sheetNotFoundError");
var exceptionMessages_1 = require("./exceptionMessages");
var Sheet = function (sheetReference) {
    var self = {};
    (function () {
        var matches = sheetReference.match("https:\\/\\/docs.google.com\\/spreadsheets\\/d\\/(.*?)($|\\/$|\\/.*|\\?.*)");
        self.id = matches !== null ? matches[1] : sheetReference;
    })();
    self.exists = function (callback) {
        var feedURL = "https://spreadsheets.google.com/feeds/worksheets/" + self.id + "/public/basic?alt=json";
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
    return self;
};
exports.default = Sheet;
//# sourceMappingURL=sheet.js.map