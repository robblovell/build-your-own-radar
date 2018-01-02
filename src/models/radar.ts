import MalformedDataError from "../exceptions/malformedDataError"
import ExceptionMessages from '../util/exceptionMessages'
import config from '../config/config'
import * as _ from "lodash";

const Radar = function (numQuadrants = 8, numRings = 6): void {
    let self: any, quadrants: any, blipNumber: any, addingQuadrant: any;
    const titles = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth'];
    config.quadrants = numQuadrants;
    config.rings = numRings;
    config.divisionAngle = 360 / config.quadrants
    blipNumber = 0;
    addingQuadrant = 0;
    quadrants = [];
    let minQuadrants = config.minQuadrants;
    let maxQuadrants = config.maxQuadrants;
    let divisionAngle = 360 / config.quadrants;

    for (let i = 0; i < config.quadrants; i++) {
        quadrants.push({order: titles[i], startAngle: config.startLocation + i * divisionAngle})
    }

    self = {};

    function setNumbers(blips: any) {
        blips.forEach(function (blip: any) {
            blip.setNumber(++blipNumber);
        });
    }

    self.addQuadrant = function (quadrant: any) {
        if (addingQuadrant >= maxQuadrants) {
            throw new MalformedDataError(ExceptionMessages.TOO_MANY_QUADRANTS(numQuadrants));
        }

        quadrants[addingQuadrant].quadrant = quadrant;
        setNumbers(quadrant.blips());
        numQuadrants = addingQuadrant++;
    };

    function allQuadrants() {
        if (addingQuadrant < minQuadrants)
            throw new MalformedDataError(ExceptionMessages.LESS_THAN_FOUR_QUADRANTS(numQuadrants));

        return _.map(quadrants, 'quadrant');
    }

    function allBlips() {
        return allQuadrants().reduce(function (blips: any, quadrant: any) {
            if (quadrant) {
                return blips.concat(quadrant.blips());
            }
            else {
                return blips;
            }
        }, []);
    }

    self.rings = function () {
        return _.sortBy(_.map(_.uniqBy(allBlips(), function (blip: any) {
            return blip.ring().name();
        }), function (blip: any) {
            return blip.ring();
        }), function (ring: any) {
            return ring.order();
        });
    };

    self.quadrants = function () {
        return quadrants;
    };

    return self;
};

export default Radar;
