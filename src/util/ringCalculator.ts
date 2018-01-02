const RingCalculator = function (numberOfRings, maxRadius):void {
  var sequence = [0, 15, 10, 6, 5, 4, 4, 3, 1];

  var self:any = {};

  self.sum = function(length) {
    return sequence.slice(0, length + 1).reduce(function (previous, current) {
      return previous + current;
    }, 0);
  };

  self.getRadius = function(ring) {
    var total = self.sum(numberOfRings);
    var sum = self.sum(ring);
    const radius = maxRadius * sum / total

    return radius < 5 ? 5: radius;
  };

  self.getMaxRadius = function() {
    return maxRadius;
  };

  return self;
};

export default RingCalculator;