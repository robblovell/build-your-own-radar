"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RingCalculator = function (numberOfRings, maxRadius) {
    var sequence = [0, 15, 10, 6, 5, 4, 4, 3, 1];
    var self = {};
    self.sum = function (length) {
        return sequence.slice(0, length + 1).reduce(function (previous, current) {
            return previous + current;
        }, 0);
    };
    self.getRadius = function (ring) {
        var total = self.sum(numberOfRings);
        var sum = self.sum(ring);
        var radius = maxRadius * sum / total;
        return radius < 5 ? 5 : radius;
    };
    self.getMaxRadius = function () {
        return maxRadius;
    };
    return self;
};
exports.default = RingCalculator;
