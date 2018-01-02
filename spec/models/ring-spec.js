chai = require('chai');
expect = chai.expect;
should = chai.should();
assert = chai.assert;

var Ring = require('../../src/models/ring').default;

describe('Ring', function () {

  it('has a name', function () {
    const ring = new Ring('My Ring');
    expect(ring.name()).equal('My Ring');
  });
  it('has a order', function () {
    const ring = new Ring('My Ring', 0);
    expect(ring.order()).equal(0);
  });
});

