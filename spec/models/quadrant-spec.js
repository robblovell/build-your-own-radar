chai = require('chai');
expect = chai.expect;

const Quadrant = require('../../src/models/quadrant').default;
const Blip = require('../../src/models/blip').default;

describe('Quadrant', function () {
  it('has a name', function () {
    const quadrant = new Quadrant('My Quadrant');

    expect(quadrant.name()).equal('My Quadrant');
  });

  it('has no blips by default', function () {
    const quadrant = new Quadrant('My Quadrant');

    expect(quadrant.blips()).that.eql([]);
  });

  it('can add a single blip', function () {
    const quadrant = new Quadrant('My Quadrant');

    quadrant.add(new Blip());

    expect(quadrant.blips().length).equal(1);
  });

  it('can add multiple blips', function () {
    const quadrant = new Quadrant('My Quadrant');

    quadrant.add([new Blip(), new Blip()]);

    expect(quadrant.blips().length).equal(2);
  });
});
