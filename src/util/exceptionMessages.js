"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ExceptionMessages = {
    TOO_MANY_QUADRANTS: function (quadrants) { return "There are more than " + (quadrants ? quadrants : 4) + " quadrant names listed in your data. Check the quadrant column for errors."; },
    TOO_MANY_RINGS: function (rings) { return "More than " + (rings ? rings : 4) + " rings."; },
    MISSING_HEADERS: 'Document is missing one or more required headers or they are misspelled. ' +
        'Check that your document contains headers for "name", "ring", "quadrant", "isNew", "description".',
    MISSING_CONTENT: 'Document is missing content.',
    LESS_THAN_FOUR_QUADRANTS: function (quadrants) { return "There are less than " + (quadrants ? quadrants : 4) + " quadrant names listed in your data. Check the quadrant column for errors."; },
    SHEET_NOT_FOUND: 'Oops! We can’t find the Google Sheet you’ve entered. Can you check the URL?'
};
exports.default = ExceptionMessages;
