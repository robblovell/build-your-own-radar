chai = require('chai');
expect = chai.expect
should = chai.should()
assert = chai.assert

const RingCalculator = require('../../src/util/ringCalculator').default;
if (!before) {
  var before = function(beforeFunc) {
    beforeAll(beforeFunc)
  }
}
describe('ringCalculator', function(){
    var ringLength, radarSize, ringCalculator;
    before(function(){
        ringLength = 4;
        radarSize = 500;
        ringCalculator = new RingCalculator(ringLength, radarSize);

    });

    it('sums up the sequences', function(){
        expect(ringCalculator.sum(ringLength)).equal(36);
    });

    it('calculates the correct radius', function(){
        expect(ringCalculator.getRadius(ringLength)).equal(radarSize);
    });

});