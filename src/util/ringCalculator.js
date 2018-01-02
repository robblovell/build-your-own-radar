"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RingCalculator = /** @class */ (function () {
    function RingCalculator(numberOfRings, maxRadius) {
        this.sequence = [0, 15, 10, 6, 5, 4, 4, 3, 1];
        this.numberOfRings = 3;
        this.maxRadius = 600;
        this.numberOfRings = numberOfRings;
        this.maxRadius = maxRadius;
    }
    RingCalculator.prototype.sum = function (length) {
        return this.sequence.slice(0, length + 1).reduce(function (previous, current) {
            return previous + current;
        }, 0);
    };
    ;
    RingCalculator.prototype.getRadius = function (ring) {
        var total = this.sum(this.numberOfRings);
        var sum = this.sum(ring);
        var radius = this.maxRadius * sum / total;
        return radius < 5 ? 5 : radius;
    };
    RingCalculator.prototype.getMaxRadius = function () {
        return this.maxRadius;
    };
    return RingCalculator;
}());
exports.default = RingCalculator;
//# sourceMappingURL=ringCalculator.js.map