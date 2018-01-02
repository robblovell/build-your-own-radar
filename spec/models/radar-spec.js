chai = require('chai');
expect = chai.expect
should = chai.should()
assert = chai.assert

const Radar = require('../../src/models/radar').default;
const Quadrant = require('../../src/models/quadrant').default;
const Ring = require('../../src/models/ring').default;
const Blip = require('../../src/models/blip').default;
const MalformedDataError = require('../../src/exceptions/malformedDataError').default;
const ExceptionMessages = require('../../src/util/exceptionMessages').default;

describe('Radar', function () {

  it('has no quadrants by default', function () {
    const radar = new Radar();

    assert.isDefined(radar.quadrants()[0]);
    assert.isDefined(radar.quadrants()[1]);
    assert.isDefined(radar.quadrants()[2]);
    assert.isDefined(radar.quadrants()[3]);
  });

  it('sets the first quadrant', function () {
    let quadrant, radar, blip;

    blip = new Blip('A', new Ring('First'));
    quadrant = new Quadrant('First');
    quadrant.add([blip]);
    radar = new Radar();

    radar.addQuadrant(quadrant);

    expect(radar.quadrants()[0].quadrant).equal(quadrant);
    expect(radar.quadrants()[0].quadrant.blips()[0].number()).equal(1);
  });

  it('sets the second quadrant', function () {
    var quadrant, radar, blip;

    blip = new Blip('A', new Ring('First'));
    quadrant = new Quadrant('Second');
    quadrant.add([blip]);
    radar = new Radar();

    radar.addQuadrant(quadrant);

    expect(radar.quadrants()[0].quadrant).equal(quadrant);
    expect(radar.quadrants()[0].quadrant.blips()[0].number()).equal(1);
  });

  it('sets the third quadrant', function () {
    var quadrant, radar, blip;

    blip = new Blip('A', new Ring('First'));
    quadrant = new Quadrant('Third');
    quadrant.add([blip]);
    radar = new Radar();

    radar.addQuadrant(quadrant);

    expect(radar.quadrants()[0].quadrant).equal(quadrant);
    expect(radar.quadrants()[0].quadrant.blips()[0].number()).equal(1);
  });

  it('sets the fourth quadrant', function () {
    var quadrant, radar, blip;

    blip = new Blip('A', new Ring('First'));
    quadrant = new Quadrant('Fourth');
    quadrant.add([blip]);
    radar = new Radar();

    radar.addQuadrant(quadrant);

    expect(radar.quadrants()[0].quadrant).equal(quadrant);
    expect(radar.quadrants()[0].quadrant.blips()[0].number()).equal(1);
  });

  it('throws an error if too many quadrants are added', function(){
    var quadrant, radar, blip;

    blip = new Blip('A', new Ring('First'));
    quadrant = new Quadrant('First');
    quadrant.add([blip]);
    radar = new Radar();

    radar.addQuadrant(quadrant);
    radar.addQuadrant(new Quadrant('Second'));
    radar.addQuadrant(new Quadrant('Third'));
    radar.addQuadrant(new Quadrant('Fourth'));
    radar.addQuadrant(new Quadrant('five'));
    radar.addQuadrant(new Quadrant('six'));
    radar.addQuadrant(new Quadrant('seven'));
    radar.addQuadrant(new Quadrant('eight'));

    expect(function() { radar.addQuadrant(new Quadrant('nine')) }).to.throw(); //new MalformedDataError(ExceptionMessages.TOO_MANY_QUADRANTS));
  });

  it('throws an error if less than min quadrants are added', function(){
    var quadrant, radar, blip;

    blip = new Blip('A', new Ring('First'));
    quadrant = new Quadrant('First');
    quadrant.add([blip]);
    radar = new Radar();

    radar.addQuadrant(quadrant);

    expect(function() { radar.rings() }).to.throw(); //new MalformedDataError(ExceptionMessages.LESS_THAN_FOUR_QUADRANTS));
  });

  describe('blip numbers', function () {
    var firstQuadrant, secondQuadrant, radar, firstRing;

    beforeEach(function () {
      firstRing = new Ring('Adopt', 0);
      firstQuadrant = new Quadrant('First');
      secondQuadrant = new Quadrant('Second');
      firstQuadrant.add([
        new Blip('A', firstRing),
        new Blip('B', firstRing)
      ]);
      secondQuadrant.add([
        new Blip('C', firstRing),
        new Blip('D', firstRing)
      ]);
      radar = new Radar();
    });

    it('sets blip numbers starting on the first quadrant', function () {
      radar.addQuadrant(firstQuadrant);

      expect(radar.quadrants()[0].quadrant.blips()[0].number()).equal(1);
      expect(radar.quadrants()[0].quadrant.blips()[1].number()).equal(2);
    });

    it('continues the number from the previous quadrant set', function () {
      radar.addQuadrant(firstQuadrant);
      radar.addQuadrant(secondQuadrant);

      expect(radar.quadrants()[1].quadrant.blips()[0].number()).equal(3);
      expect(radar.quadrants()[1].quadrant.blips()[1].number()).equal(4);
    });
  });

  describe('rings', function () {
    var quadrant, radar, firstRing, secondRing, otherQuadrant;

    beforeEach(function () {
      firstRing = new Ring('Adopt', 0);
      secondRing = new Ring('Hold', 1);
      quadrant = new Quadrant('Fourth');
      otherQuadrant = new Quadrant('Other');
      radar = new Radar();
    });

    it('returns an array for a given set of blips', function () {
      quadrant.add([
        new Blip('A', firstRing),
        new Blip('B', secondRing)
      ]);

      radar.addQuadrant(quadrant);
      radar.addQuadrant(otherQuadrant);
      radar.addQuadrant(otherQuadrant);
      radar.addQuadrant(otherQuadrant);

      expect(radar.rings()).to.deep.equal([firstRing, secondRing]);
    });

    it('has unique rings', function () {
      quadrant.add([
        new Blip('A', firstRing),
        new Blip('B', firstRing),
        new Blip('C', secondRing)
      ]);

        radar.addQuadrant(quadrant);
        radar.addQuadrant(otherQuadrant);
        radar.addQuadrant(otherQuadrant);
        radar.addQuadrant(otherQuadrant);

        expect(radar.rings()).to.deep.equal([firstRing, secondRing]);
    });

    it('has sorts by the ring order', function () {
      quadrant.add([
        new Blip('C', secondRing),
        new Blip('A', firstRing),
        new Blip('B', firstRing)
      ]);

      radar.addQuadrant(quadrant);
      radar.addQuadrant(otherQuadrant);
      radar.addQuadrant(otherQuadrant);
      radar.addQuadrant(otherQuadrant);

      expect(radar.rings()).to.deep.equal([firstRing, secondRing]);
    });
  });
});
