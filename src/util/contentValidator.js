"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var malformedDataError_1 = require("../../src/exceptions/malformedDataError");
var exceptionMessages_1 = require("./exceptionMessages");
var ContentValidator = function (columnNames) {
    var self = {};
    columnNames = columnNames.map(function (columnName) {
        return columnName.trim();
    });
    self.verifyContent = function () {
        if (columnNames.length == 0) {
            throw new malformedDataError_1.default(exceptionMessages_1.default.MISSING_CONTENT);
        }
    };
    self.verifyHeaders = function () {
        _.each(['name', 'ring', 'quadrant'], function (field) {
            if (columnNames.indexOf(field) == -1) {
                throw new malformedDataError_1.default(exceptionMessages_1.default.MISSING_HEADERS);
            }
        });
    };
    return self;
};
exports.default = ContentValidator;
//# sourceMappingURL=contentValidator.js.map