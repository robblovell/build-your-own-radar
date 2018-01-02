import MalformedDataError from "../exceptions/malformedDataError"
import ExceptionMessages from '../util/exceptionMessages'
import config from '../config/config'
import * as _ from "lodash";
// const _ = {
//   map: map,
//   uniqBy: uniqBy,
//   sortBy: sortBy
// };

const Radar = function(numQuadrants=6, numRings=4):void {
  let self, quadrants, blipNumber, addingQuadrant;
  const titles = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];
  config.quadrants = numQuadrants;
  config.rings = numRings;
  config.divisionAngle = 360/config.quadrants
  blipNumber = 0;
  addingQuadrant = 0;
  quadrants = [];

  for (let i=0;i<config.quadrants;i++) {
    quadrants.push({order: titles[i], startAngle: config.startLocation+i*config.divisionAngle})
  }

  self = {};

  function setNumbers(blips) {
    blips.forEach(function (blip) {
      blip.setNumber(++blipNumber);
    });
  }

  self.addQuadrant = function (quadrant) {
    if(addingQuadrant >= config.maxQuadrants) {
      throw new MalformedDataError(ExceptionMessages.TOO_MANY_QUADRANTS(config.quadrants));
    }
    quadrants[addingQuadrant].quadrant = quadrant;
    setNumbers(quadrant.blips());
    addingQuadrant++;
  };

   function allQuadrants() {
    if (addingQuadrant < config.minQuadrants)
      throw new MalformedDataError(ExceptionMessages.LESS_THAN_FOUR_QUADRANTS(config.quadrants));

    return _.map(quadrants, 'quadrant');
  }

  function allBlips() {
    return allQuadrants().reduce(function (blips, quadrant) {
      return blips.concat(quadrant.blips());
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

export default Radar;
