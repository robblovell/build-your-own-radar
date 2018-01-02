"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var malformedDataError_1 = require("../exceptions/malformedDataError");
var exceptionMessages_1 = require("../util/exceptionMessages");
var config_1 = require("../config/config");
var _ = require("lodash");
var Radar = function (numQuadrants, numRings) {
    if (numQuadrants === void 0) { numQuadrants = 8; }
    if (numRings === void 0) { numRings = 6; }
    var self, quadrants, blipNumber, addingQuadrant;
    var titles = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];
    config_1.default.quadrants = numQuadrants;
    config_1.default.rings = numRings;
    config_1.default.divisionAngle = 360 / config_1.default.quadrants;
    blipNumber = 0;
    addingQuadrant = 0;
    quadrants = [];
    var minQuadrants = config_1.default.minQuadrants;
    var maxQuadrants = config_1.default.maxQuadrants;
    var divisionAngle = 360 / config_1.default.quadrants;
    for (var i = 0; i < config_1.default.quadrants; i++) {
        quadrants.push({ order: titles[i], startAngle: config_1.default.startLocation + i * divisionAngle });
    }
    self = {};
    function setNumbers(blips) {
        blips.forEach(function (blip) {
            blip.setNumber(++blipNumber);
        });
    }
    self.addQuadrant = function (quadrant) {
        if (addingQuadrant >= maxQuadrants) {
            throw new malformedDataError_1.default(exceptionMessages_1.default.TOO_MANY_QUADRANTS(numQuadrants));
        }
        quadrants[addingQuadrant].quadrant = quadrant;
        setNumbers(quadrant.blips());
        numQuadrants = addingQuadrant++;
    };
    function allQuadrants() {
        if (addingQuadrant < minQuadrants)
            throw new malformedDataError_1.default(exceptionMessages_1.default.LESS_THAN_FOUR_QUADRANTS(numQuadrants));
        return _.map(quadrants, 'quadrant');
    }
    function allBlips() {
        return allQuadrants().reduce(function (blips, quadrant) {
            if (quadrant) {
                return blips.concat(quadrant.blips());
            }
            else {
                return blips;
            }
        }, []);
    }
    self.rings = function () {
        return _.sortBy(_.map(_.uniqBy(allBlips(), function (blip) {
            return blip.ring().name();
        }), function (blip) {
            return blip.ring();
        }), function (ring) {
            return ring.order();
        });
    };
    self.quadrants = function () {
        return quadrants;
    };
    return self;
};
exports.default = Radar;
//# sourceMappingURL=radar.js.map