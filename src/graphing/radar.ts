import * as d3 from "d3";

import * as d3tip from "d3-tip";
import * as Chance from "chance";
import * as _ from "lodash";
import config from "../config/config";
import RingCalculator from "../util/ringCalculator";

let chance:any;
const MIN_BLIP_WIDTH = 12;

const Radar = function (size:any, radar:any): void {
    let svg:any, radarElement:any;

    let tip = (<any>(<any>d3tip)()).attr('class', 'd3-tip').html(function (text:any) {
        return text;
    });

    tip.direction(function () {
        if (d3.select('.quadrant-table.selected').node()) {
            let selectedQuadrant = d3.select('.quadrant-table.selected');
            if (selectedQuadrant.classed('first') || selectedQuadrant.classed('fourth'))
                return 'ne';
            else
                return 'nw';
        }
        return 'n';
    });

    let ringCalculator:any = new RingCalculator(radar.rings().length, center());

    let self: any = {};

    function center() {
        return Math.round(size / 2);
    }

    function toRadian(angleInDegrees:any) {
        return Math.PI * angleInDegrees / 180;
    }

    // function plotLines(quadrantGroup:any, quadrant:any) {
        // todo: make this work with arbitrary numbers of rings and quadrants.
        // let startX = size * (1 - (-Math.sin(toRadian(quadrant.startAngle)) + 1) / 2);
        // let endX = size * (1 - (-Math.sin(toRadian(quadrant.startAngle - config.divisionAngle)) + 1) / 2);
        //
        // let startY = size * (1 - (Math.cos(toRadian(quadrant.startAngle)) + 1) / 2);
        // let endY = size * (1 - (Math.cos(toRadian(quadrant.startAngle - config.divisionAngle)) + 1) / 2);
        //
        // if (startY > endY) {
        //   let aux = endY;
        //   endY = startY;
        //   startY = aux;
        // }
        //
        // quadrantGroup.append('line')
        //   .attr('x1', center()).attr('x2', center())
        //   .attr('y1', startY - 2).attr('y2', endY + 2)
        //   .attr('stroke-width', 10);
        //
        // quadrantGroup.append('line')
        //   .attr('x1', endX).attr('y1', center())
        //   .attr('x2', startX).attr('y2', center())
        //   .attr('stroke-width', 10);
    // }

    function plotQuadrant(rings:any, quadrant:any) {
        let quadrantGroup = svg.append('g')
            .attr('class', 'quadrant-group quadrant-group-' + quadrant.order)
            .on('mouseover', mouseoverQuadrant.bind({}, quadrant.order))
            .on('mouseout', mouseoutQuadrant.bind({}, quadrant.order))
            .on('click', selectQuadrant.bind({}, quadrant.order, quadrant.startAngle));

        rings.forEach(function (ring:any, i:any) {
            let arc = d3.arc()
                .innerRadius(ringCalculator.getRadius(i))
                .outerRadius(ringCalculator.getRadius(i + 1))
                .startAngle(toRadian(quadrant.startAngle - config.startLocation))
                .endAngle(toRadian(quadrant.startAngle + config.divisionAngle - 1 - config.startLocation));

            quadrantGroup.append('path')
                .attr('d', arc)
                .attr('class', 'ring-arc-' + ring.order())
                .attr('transform', 'translate(' + center() + ', ' + center() + ')'); // move to central location.
        });

        const angle = quadrant.startAngle + config.divisionAngle/2;// - config.startLocation;
        // console.log(angle);
        quadrantGroup.append('text')
            .attr('class', 'line-text')
            .attr('y', center() + (ringCalculator.getMaxRadius()-5)*Math.sin(toRadian(angle)))
            .attr('x', center() + (ringCalculator.getMaxRadius()-20)*Math.cos(toRadian(angle)))
            .attr('text-anchor', 'middle')
            .text(quadrant.quadrant.name());

        return quadrantGroup;
    }

    function plotTexts(quadrantGroup:any, rings:any, quadrant:any) {

        const fontHeight = 10;
        const offAxisAdjust = 10;
        const firstLabelAdjust = 10;
        const angle = quadrant.startAngle + config.divisionAngle - config.startLocation;
        // console.log(angle);
        rings.forEach(function (ring:any, i:any) {
            const isOddRow=i%2;
            const adjustRight = (i == rings.length-1? firstLabelAdjust : 0)
            if (angle > 225) {
                quadrantGroup.append('text')
                    .attr('class', 'line-text')
                    .attr('y', center() + config.rings+isOddRow*fontHeight+offAxisAdjust)
                    .attr('x', adjustRight + center() - (ringCalculator.getRadius(i) + ringCalculator.getRadius(i + 1)) / 2)
                    .attr('text-anchor', 'middle')
                    .text(ring.name());
            }
            else {
                quadrantGroup.append('text')
                    .attr('class', 'line-text')
                    .attr('y', center() + config.rings+isOddRow*fontHeight+offAxisAdjust)
                    .attr('x', center() + (ringCalculator.getRadius(i) + ringCalculator.getRadius(i + 1)) / 2)
                    .attr('text-anchor', 'middle')
                    .text(ring.name());
                // }
            }
        });
    }

    function triangle(blip:any, x:any, y:any, order:any, group:any) {
        return group.append('path').attr('d', "M412.201,311.406c0.021,0,0.042,0,0.063,0c0.067,0,0.135,0,0.201,0c4.052,0,6.106-0.051,8.168-0.102c2.053-0.051,4.115-0.102,8.176-0.102h0.103c6.976-0.183,10.227-5.306,6.306-11.53c-3.988-6.121-4.97-5.407-8.598-11.224c-1.631-3.008-3.872-4.577-6.179-4.577c-2.276,0-4.613,1.528-6.48,4.699c-3.578,6.077-3.26,6.014-7.306,11.723C402.598,306.067,405.426,311.406,412.201,311.406")
            .attr('transform', 'scale(' + (blip.width / 34) + ') translate(' + (-404 + x * (34 / blip.width) - 17) + ', ' + (-282 + y * (34 / blip.width) - 17) + ')')
            .attr('class', order);
    }

    function triangleLegend(x:any, y:any, group:any) {
        return group.append('path').attr('d', "M412.201,311.406c0.021,0,0.042,0,0.063,0c0.067,0,0.135,0,0.201,0c4.052,0,6.106-0.051,8.168-0.102c2.053-0.051,4.115-0.102,8.176-0.102h0.103c6.976-0.183,10.227-5.306,6.306-11.53c-3.988-6.121-4.97-5.407-8.598-11.224c-1.631-3.008-3.872-4.577-6.179-4.577c-2.276,0-4.613,1.528-6.48,4.699c-3.578,6.077-3.26,6.014-7.306,11.723C402.598,306.067,405.426,311.406,412.201,311.406")
            .attr('transform', 'scale(' + (22 / 64) + ') translate(' + (-404 + x * (64 / 22) - 17) + ', ' + (-282 + y * (64 / 22) - 17) + ')');
    }

    function circle(blip:any, x:any, y:any, order:any, group:any) {
        return (group || svg).append('path')
            .attr('d', "M420.084,282.092c-1.073,0-2.16,0.103-3.243,0.313c-6.912,1.345-13.188,8.587-11.423,16.874c1.732,8.141,8.632,13.711,17.806,13.711c0.025,0,0.052,0,0.074-0.003c0.551-0.025,1.395-0.011,2.225-0.109c4.404-0.534,8.148-2.218,10.069-6.487c1.747-3.886,2.114-7.993,0.913-12.118C434.379,286.944,427.494,282.092,420.084,282.092")
            .attr('transform', 'scale(' + (blip.width / 34) + ') translate(' + (-404 + x * (34 / blip.width) - 17) + ', ' + (-282 + y * (34 / blip.width) - 17) + ')')
            .attr('class', order);
    }

    function circleLegend(x:any, y:any, group:any) {
        return (group || svg).append('path')
            .attr('d', "M420.084,282.092c-1.073,0-2.16,0.103-3.243,0.313c-6.912,1.345-13.188,8.587-11.423,16.874c1.732,8.141,8.632,13.711,17.806,13.711c0.025,0,0.052,0,0.074-0.003c0.551-0.025,1.395-0.011,2.225-0.109c4.404-0.534,8.148-2.218,10.069-6.487c1.747-3.886,2.114-7.993,0.913-12.118C434.379,286.944,427.494,282.092,420.084,282.092")
            .attr('transform', 'scale(' + (22 / 64) + ') translate(' + (-404 + x * (64 / 22) - 17) + ', ' + (-282 + y * (64 / 22) - 17) + ')');
    }

    function addRing(ring:any, order:any) {
        let table = d3.select('.quadrant-table.' + order);
        table.append('h3').text(ring);
        return table.append('ul');
    }

    function calculateBlipCoordinates(blip:any, chance:any, minRadius:any, maxRadius:any, startAngle:any) {
        const halfBlipWidth = blip.width / 2;
        let minimum = minRadius + blip.width + halfBlipWidth-5;
        let maximum = maxRadius - halfBlipWidth-5;
        if (minimum > maximum) {
            maximum = minimum + 1
        }

        let radius = chance.floating({min: minimum, max: maximum});

        let angle = toRadian(chance.integer({
            min: startAngle + blip.width + halfBlipWidth-5,
            max: startAngle + config.divisionAngle - halfBlipWidth-5
        }));

        let x = center() + radius * Math.cos(angle);
        let y = center() + radius * Math.sin(angle);

        return [x, y];
    }

    // function calculateQuandrantLabelCoordinates(startAngle:any) {
    //     let radius = ringCalculator.getMaxRadius();
    //     let angle = toRadian(startAngle + config.divisionAngle / 2);
    //     let x = center() + radius * Math.cos(angle);
    //     let y = center() + radius * Math.sin(angle);
    //
    //     return [x, y];
    // }

    function thereIsCollision(blip:any, coordinates:any, allCoordinates:any) {
        return allCoordinates.some(function (currentCoordinates:any) {
            return (Math.abs(currentCoordinates[0] - coordinates[0]) < blip.width) && (Math.abs(currentCoordinates[1] - coordinates[1]) < blip.width)
        });
    }


    function plotBlips(quadrantGroup:any, rings:any, quadrantWrapper:any) {
        let blips:any, quadrant:any, startAngle:any, order:any;

        quadrant = quadrantWrapper.quadrant;
        startAngle = quadrantWrapper.startAngle;
        order = quadrantWrapper.order;
        //
        // const container:any = d3.select('.quadrant-table.' + order)
        //     .append('h2')
        //     .attr('class', 'quadrant-table__name')
        //     .text(quadrant.name());

        blips = quadrant.blips();
        rings.forEach(function (ring:any, i:any) {
            let ringBlips = blips.filter(function (blip:any) {
                return blip.ring() == ring;
            });

            if (ringBlips.length == 0) {
                return;
            }

            let maxRadius:any, minRadius:any;

            minRadius = ringCalculator.getRadius(i);
            maxRadius = ringCalculator.getRadius(i + 1);

            let sumRing = ring.name().split('').reduce(function (p:any, c:any) {
                return p + c.charCodeAt(0);
            }, 0);
            let sumQuadrant = quadrant.name().split('').reduce(function (p:any, c:any) {
                return p + c.charCodeAt(0);
            }, 0);
            chance = new Chance(Math.PI * sumRing * ring.name().length * sumQuadrant * quadrant.name().length);

            let ringList = addRing(ring.name(), order);
            let allBlipCoordinatesInRing:any = [];

            ringBlips.forEach(function (blip:any) {
                if (blip.name() == "" || blip.name() == "none") {
                    return;
                }
                const coordinates = findBlipCoordinates(blip,
                    minRadius,
                    maxRadius,
                    startAngle,
                    allBlipCoordinatesInRing);

                allBlipCoordinatesInRing.push(coordinates);
                drawBlipInCoordinates(blip, coordinates, order, quadrantGroup, ringList);
            });

        });
    }

    function findBlipCoordinates(blip:any, minRadius:any, maxRadius:any, startAngle:any, allBlipCoordinatesInRing:any):any {
        const maxIterations = 10;
        let coordinates = calculateBlipCoordinates(blip, chance, minRadius, maxRadius, startAngle);
        let iterationCounter = 0;
        let foundAPlace = false;

        while (iterationCounter < maxIterations) {
            if (thereIsCollision(blip, coordinates, allBlipCoordinatesInRing)) {
                coordinates = calculateBlipCoordinates(blip, chance, minRadius, maxRadius, startAngle);
            } else {
                foundAPlace = true;
                break;
            }
            iterationCounter++;
        }

        if (!foundAPlace && blip.width > MIN_BLIP_WIDTH) {
            blip.width = blip.width - 1;
            return findBlipCoordinates(blip, minRadius, maxRadius, startAngle, allBlipCoordinatesInRing);
        } else {
            return coordinates;
        }
    }

    function drawBlipInCoordinates(blip:any, coordinates:any, order:any, quadrantGroup:any, ringList:any) {
        let x = coordinates[0];
        let y = coordinates[1];

        let group = quadrantGroup.append('g').attr('class', 'blip-link');

        if (blip.isNew()) {
            triangle(blip, x, y, order, group);
        } else {
            circle(blip, x, y, order, group);
        }

        // group.append('text')
        //     .attr('x', x)
        //     .attr('y', y + 4)
        //     .attr('class', 'blip-text')
        //     // derive font-size from current blip width
        //     .style('font-size', ((blip.width * 10) / 22) + 'px')
        //     .attr('text-anchor', 'middle')
        //     .text(blip.number());

        let blipListItem = ringList.append('li');
        let blipText = blip.number() + '. ' + blip.name() + (blip.topic() ? ('. - ' + blip.topic()) : '');
        blipListItem.append('div')
            .attr('class', 'blip-list-item')
            .text(blipText);

        let blipItemDescription = blipListItem.append('div')
            .attr('class', 'blip-item-description');
        if (blip.description()) {
            blipItemDescription.append('p').html(blip.description());
        }

        let mouseOver = function () {
            d3.selectAll('g.blip-link').attr('opacity', 0.3);
            group.attr('opacity', 1.0);
            blipListItem.selectAll('.blip-list-item').classed('highlight', true);
            tip.show(blip.name(), group.node());
        };

        let mouseOut = function () {
            d3.selectAll('g.blip-link').attr('opacity', 1.0);
            blipListItem.selectAll('.blip-list-item').classed('highlight', false);
            tip.hide().style('left', 0).style('top', 0);
        };

        blipListItem.on('mouseover', mouseOver).on('mouseout', mouseOut);
        group.on('mouseover', mouseOver).on('mouseout', mouseOut);

        let clickBlip = function () {
            d3.select('.blip-item-description.expanded').node() !== blipItemDescription.node() &&
            d3.select('.blip-item-description.expanded').classed("expanded", false);
            blipItemDescription.classed("expanded", !blipItemDescription.classed("expanded"));

            blipItemDescription.on('click', function () {
                d3.event.stopPropagation();
            });
        };

        blipListItem.on('click', clickBlip);
    }

    function removeHomeLink() {
        d3.select('.home-link').remove();
    }

    function createHomeLink(pageElement:any) {
        if (pageElement.select('.home-link').empty()) {
            pageElement.append('div')
                .html('&#171; Back to Radar home')
                .classed('home-link', true)
                .classed('selected', true)
                .on('click', redrawFullRadar)
                .append('g')
                .attr('fill', '#626F87')
                .append('path')
                .attr('d', 'M27.6904224,13.939279 C27.6904224,13.7179572 27.6039633,13.5456925 27.4314224,13.4230122 L18.9285959,6.85547454 C18.6819796,6.65886965 18.410898,6.65886965 18.115049,6.85547454 L9.90776939,13.4230122 C9.75999592,13.5456925 9.68592041,13.7179572 9.68592041,13.939279 L9.68592041,25.7825947 C9.68592041,25.979501 9.74761224,26.1391059 9.87092041,26.2620876 C9.99415306,26.3851446 10.1419265,26.4467108 10.3145429,26.4467108 L15.1946918,26.4467108 C15.391698,26.4467108 15.5518551,26.3851446 15.6751633,26.2620876 C15.7984714,26.1391059 15.8600878,25.979501 15.8600878,25.7825947 L15.8600878,18.5142424 L21.4794061,18.5142424 L21.4794061,25.7822933 C21.4794061,25.9792749 21.5410224,26.1391059 21.6643306,26.2620876 C21.7876388,26.3851446 21.9477959,26.4467108 22.1448776,26.4467108 L27.024951,26.4467108 C27.2220327,26.4467108 27.3821898,26.3851446 27.505498,26.2620876 C27.6288061,26.1391059 27.6904224,25.9792749 27.6904224,25.7822933 L27.6904224,13.939279 Z M18.4849735,0.0301425662 C21.0234,0.0301425662 23.4202449,0.515814664 25.6755082,1.48753564 C27.9308469,2.45887984 29.8899592,3.77497963 31.5538265,5.43523218 C33.2173918,7.09540937 34.5358755,9.05083299 35.5095796,11.3015031 C36.4829061,13.5518717 36.9699469,15.9439104 36.9699469,18.4774684 C36.9699469,20.1744196 36.748098,21.8101813 36.3044755,23.3844521 C35.860551,24.9584216 35.238498,26.4281731 34.4373347,27.7934053 C33.6362469,29.158336 32.6753041,30.4005112 31.5538265,31.5197047 C30.432349,32.6388982 29.1876388,33.5981853 27.8199224,34.3973401 C26.4519041,35.1968717 24.9791531,35.8176578 23.4016694,36.2606782 C21.8244878,36.7033971 20.1853878,36.9247943 18.4849735,36.9247943 C16.7841816,36.9247943 15.1453837,36.7033971 13.5679755,36.2606782 C11.9904918,35.8176578 10.5180429,35.1968717 9.15002449,34.3973401 C7.78223265,33.5978839 6.53752245,32.6388982 5.41612041,31.5197047 C4.29464286,30.4005112 3.33339796,29.158336 2.53253673,27.7934053 C1.73144898,26.4281731 1.10909388,24.9584216 0.665395918,23.3844521 C0.22184898,21.8101813 0,20.1744196 0,18.4774684 C0,16.7801405 0.22184898,15.1446802 0.665395918,13.5704847 C1.10909388,11.9962138 1.73144898,10.5267637 2.53253673,9.16153157 C3.33339796,7.79652546 4.29464286,6.55435031 5.41612041,5.43523218 C6.53752245,4.3160387 7.78223265,3.35675153 9.15002449,2.55752138 C10.5180429,1.75806517 11.9904918,1.13690224 13.5679755,0.694183299 C15.1453837,0.251464358 16.7841816,0.0301425662 18.4849735,0.0301425662 L18.4849735,0.0301425662 Z');
        }
    }

    function removeRadarLegend() {
        d3.select('.legend').remove();
    }

    function drawLegend(order:any, angle:any) {
        removeRadarLegend();

        let triangleKey = "New or moved";
        let circleKey = "No change";

        let container = d3.select('svg').append('g')
            .attr('class', 'legend legend' + "-" + order);

        let x = 2.5 * size / 5;
        let y = 20;
        if (angle < 50 || angle > 270) {
            x = 20;
        }
        else if (angle > 180 && angle < 270) {
            x = size;
        }
        else if (angle > 225 && angle < 305) {
            x = size;
            y = 4 * size / 5;
        }

        d3.select('.legend')
            .attr('class', 'legend legend-' + order)
            .transition()
            .style('visibility', 'visible');

        triangleLegend(x, y, container);

        container
            .append('text')
            .attr('x', x + 15)
            .attr('y', y + 5)
            .attr('font-size', '0.8em')
            .text(triangleKey);

        circleLegend(x, y + 20, container);

        container
            .append('text')
            .attr('x', x + 15)
            .attr('y', y + 25)
            .attr('font-size', '0.8em')
            .text(circleKey);
    }

    function redrawFullRadar() {
        removeHomeLink();
        removeRadarLegend();

        svg.style('left', 0).style('right', 0);

        d3.selectAll('.button')
            .classed('selected', false)
            .classed('full-view', true);

        d3.selectAll('.quadrant-table').classed('selected', false);
        d3.selectAll('.home-link').classed('selected', false);

        d3.selectAll('.quadrant-group')
            .transition()
            .duration(1000)
            .attr('transform', 'scale(1)');

        d3.selectAll('.quadrant-group .blip-link')
            .transition()
            .duration(1000)
            .attr('transform', 'scale(1)');

        d3.selectAll('.quadrant-group')
            .style('pointer-events', 'auto');
    }

    function plotRadarHeader() {
        let header = d3.select('body').insert('header', "#radar");
        header.append('div')
            .attr('class', 'radar-title')
            .append('div')
            .attr('class', 'radar-title__text')
            .append('h1')
            .text(document.title)
            .style('cursor', 'pointer')
            .on('click', redrawFullRadar);

        header.select('.radar-title')
            .append('div')
            .attr('class', 'radar-title__logo')
            .html('<a href="https://marketing.move.com"> <img src="/images/MoveLogo.png" /> </a>');

        return header;
    }

    function plotQuadrantButtons(quadrants:any, header:any) {

        function addButton(quadrant:any) {
            radarElement
                .append('div')
                .attr('class', 'quadrant-table ' + quadrant.order);

            header.append('div')
                .attr('class', 'button ' + quadrant.order + ' full-view')
                .text(quadrant.quadrant.name())
                .on('mouseover', mouseoverQuadrant.bind({}, quadrant.order))
                .on('mouseout', mouseoutQuadrant.bind({}, quadrant.order))
                .on('click', selectQuadrant.bind({}, quadrant.order, quadrant.startAngle));
        }

        _.each(quadrants, function (q:any) {
            addButton(q);
        });


        header.append('div')
            .classed('print-radar button no-capitalize', true)
            .text('Print this radar')
            .on('click', window.print.bind(window));
    }

    function plotRadarFooter() {
        d3.select('body')
            .insert('div', '#radar-plot + *')
            .attr('id', 'footer')
            .append('div')
            .attr('class', 'footer-content')
            .append('p')
            .html('Created for  <a href="https://marketing.move.com"> Move Inc</a>. ')
    }

    function mouseoverQuadrant(order:any) {
        d3.select('.quadrant-group-' + order).style('opacity', 1);
        d3.selectAll('.quadrant-group:not(.quadrant-group-' + order + ')').style('opacity', 0.3);
    }

    function mouseoutQuadrant(order:any) {
        d3.selectAll('.quadrant-group:not(.quadrant-group-' + order + ')').style('opacity', 1);
    }

    function selectQuadrant(order:any, startAngle:any) {
        d3.selectAll('.home-link').classed('selected', false);
        createHomeLink(d3.select('header'));

        d3.selectAll('.button').classed('selected', false).classed('full-view', false);
        d3.selectAll('.button.' + order).classed('selected', true);
        d3.selectAll('.quadrant-table').classed('selected', false);
        d3.selectAll('.quadrant-table.' + order).classed('selected', true);
        d3.selectAll('.blip-item-description').classed('expanded', false);

        let scale = 1.5;
        let newSize = scale * size / 2;

        const angle = startAngle + config.divisionAngle / 2 - config.startLocation;
        let directionX = -Math.sin(toRadian(angle));
        let directionY = Math.cos(toRadian(angle));
        let adjustX = newSize / 2 * directionX;
        let adjustY = newSize / 2 * directionY;
        let adjustWindowX = -size / 5;
        let adjustWindowY = -size / 4;
        let translateX = adjustX + adjustWindowX;
        let translateY = adjustY + adjustWindowY;

        let scaleAll = 0;

        let translateXAll = 0;
        let translateYAll = 0;

        let moveRight = (window.innerWidth);
        let moveLeft = size / 2.4;
        let moveDown = window.innerHeight;
        let moveUp = 0;

        let blipScale = 3 / 4;
        let blipTranslate = (1 - blipScale) / blipScale;

        // move and scale the target pie into position.
        svg.style('left', moveLeft + 'px').style('right', moveRight + 'px').style('top', moveUp + 'px').style('bottom', moveDown + 'px');
        d3.select('.quadrant-group-' + order)
            .transition()
            .duration(1000)
            .attr('transform', 'translate(' + translateX + ',' + translateY + ')scale(' + scale + ')');

        d3.selectAll('.quadrant-group-' + order + ' .blip-link text').each(function () {
            let x: any = d3.select(this).attr('x');
            let y: any = d3.select(this).attr('y');
            d3.select((<any>this).parentNode)
                .transition()
                .duration(1000)
                .attr('transform', 'scale(' + blipScale + ')translate(' + blipTranslate * x + ',' + blipTranslate * y + ')');
        });

        d3.selectAll('.quadrant-group')
            .style('pointer-events', 'auto');

        d3.selectAll('.quadrant-group:not(.quadrant-group-' + order + ')')
            .transition()
            .duration(1000)
            .style('pointer-events', 'none')
            // .attr('transform', 'scale(1)');

            .attr('transform', 'translate(' + translateXAll + ',' + translateYAll + ')scale(' + scaleAll + ')');

        if (d3.select('.legend.legend-' + order).empty()) {
            drawLegend(order, angle);
        }
    }

    self.init = function () {
        radarElement = d3.select('body').append('div').attr('id', 'radar');
        return self;
    };

    self.plot = function () {
        let rings:any, quadrants:any;

        rings = radar.rings();
        quadrants = radar.quadrants();
        let header = plotRadarHeader();

        plotQuadrantButtons(quadrants, header);

        radarElement.style('height', size + 14 + 'px');
        svg = radarElement.append("svg").call(tip);
        svg.attr('id', 'radar-plot').attr('width', size * 2+100).attr('height', size + 14);

        _.each(quadrants, function (quadrant:any) {
            let quadrantGroup = plotQuadrant(rings, quadrant);
            // plotLines(quadrantGroup, quadrant);
            plotTexts(quadrantGroup, rings, quadrant);
            plotBlips(quadrantGroup, rings, quadrant);
        });

        plotRadarFooter();
    };

    return self;
};

export default Radar;
