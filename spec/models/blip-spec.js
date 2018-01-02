chai = require('chai');
expect = chai.expect;

const Blip = require('../../src/models/blip').default;
const Ring = require('../../src/models/ring').default;

describe('Blip', function () {
  let blip;

  beforeEach(function () {
    blip = new Blip(
      'My Blip',
      new Ring('My Ring')
    );
  });

  it('has a name', function () {
    expect(blip.name()).equal('My Blip');
  });

  it('has a ring', function () {
    expect(blip.ring().name()).equal('My Ring');
  });

  it('has a default number', function () {
    expect(blip.number()).equal(-1);
  });

  it('sets the number', function () {
    blip.setNumber(1);
    expect(blip.number()).equal(1);
  });

  it('is new', function () {
    blip = new Blip(
      'My Blip',
      new Ring('My Ring'),
      true
    );

    expect(blip.isNew()).equal(true);
  });

  it('is not new', function () {
    blip = new Blip(
      'My Blip',
      new Ring('My Ring'),
      false
    );

    expect(blip.isNew()).equal(false);
  });
});
