"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("d3");
var exceptionMessages_1 = require("./exceptionMessages");
var sheet_1 = require("./sheet");
var contentValidator_1 = require("./contentValidator");
var sheetNotFoundError_1 = require("../exceptions/sheetNotFoundError");
var malformedDataError_1 = require("../exceptions/malformedDataError");
var radar_1 = require("../graphing/radar");
var blip_1 = require("../models/blip");
var ring_1 = require("../models/ring");
var quadrant_1 = require("../models/quadrant");
var radar_2 = require("../models/radar");
var inputSanitizer_1 = require("./inputSanitizer");
var _ = require("lodash");
var config_1 = require("../config/config");
var Tabletop = require("tabletop");
var plotRadar = function (title, blips) {
    document.title = title;
    d3.selectAll(".loading").remove();
    var rings = _.map(_.uniqBy(blips, 'ring'), 'ring');
    var ringMap = {};
    var maxRings = config_1.default.maxRings;
    var numRings = 0;
    _.each(rings, function (ringName, i) {
        if (i == maxRings) {
            throw new malformedDataError_1.default(exceptionMessages_1.default.TOO_MANY_RINGS(config_1.default.maxRings));
        }
        if (i > numRings) {
            numRings = i;
        }
        ringMap[ringName] = new ring_1.default(ringName, i);
    });
    var quadrants = {};
    _.each(blips, function (blip) {
        if (!quadrants[blip.quadrant]) {
            quadrants[blip.quadrant] = new quadrant_1.default(_.capitalize(blip.quadrant));
        }
        quadrants[blip.quadrant].add(new blip_1.default(blip.name, ringMap[blip.ring], blip.isNew.toLowerCase() === 'true', blip.topic, blip.description));
    });
    var numQuadrants = _.keys(quadrants).length;
    var radar = new radar_2.default(numQuadrants, numRings);
    _.each(quadrants, function (quadrant) {
        radar.addQuadrant(quadrant);
    });
    var size = (window.innerWidth - 133) < 350 ? 350 : window.innerWidth - 133;
    console.log(size);
    console.log(window.innerWidth);
    if (size > 600) {
        size = 600;
    }
    new radar_1.default(size, radar).init().plot();
};
var GoogleSheet = function (sheetReference, sheetName) {
    var self = {};
    self.build = function () {
        var sheet = new sheet_1.default(sheetReference);
        sheet.exists(function (notFound) {
            if (notFound) {
                plotErrorMessage(notFound);
                return;
            }
            Tabletop.init({
                key: sheet.id,
                callback: createBlips
            });
        });
        function createRadar(radarSheet, glossarySheets) {
            var sanatizer = new inputSanitizer_1.default();
            var blips = [];
            _.forEach(radarSheet, function (row) {
                var names = row['name'].split(',');
                names = _.map(names, function (name) { return name.trim(); });
                _.map(names, function (name) {
                    var details = glossarySheets[row.quadrant].find(function (element) { return element.name === name; });
                    blips.push(sanatizer.sanitize({
                        name: name,
                        ring: row.ring,
                        quadrant: row.quadrant,
                        isNew: details && details.isNew ? details.isNew : "not found",
                        description: details && details.description ? details.description : "glossary entry missing",
                    }));
                });
            });
            return blips;
        }
        function createBlips(__, tabletop) {
            try {
                if (!sheetName) {
                    sheetName = tabletop.foundSheetNames[0].trim();
                }
                var columnNames = tabletop.sheets(sheetName).columnNames;
                var contentValidator = new contentValidator_1.default(columnNames);
                contentValidator.verifyContent();
                contentValidator.verifyHeaders();
                var all = tabletop.sheets(sheetName).all();
                // let blips = _.map(all, new InputSanitizer().sanitize);
                var quadrantNames = _.map(all, function (row) { return row.quadrant.trim(); });
                // get the unique quadrant names so that the glossary sheets can be imported.
                quadrantNames = _.uniq(quadrantNames);
                // console.log("All: "+JSON.stringify(all))
                // console.log("Columns: "+JSON.stringify(columnNames))
                // console.log("Quadrants: "+JSON.stringify(quadrantNames))
                var glossarySheets_1 = {};
                _.forEach(quadrantNames, function (sheetName) {
                    // console.log("Sheet: "+sheetName)
                    glossarySheets_1[sheetName] = tabletop.sheets(sheetName).all();
                    // console.log("Sheet: "+JSON.stringify(glossarySheets[sheetName]))
                });
                var blips = createRadar(all, glossarySheets_1);
                plotRadar(tabletop.googleSheetName, blips);
            }
            catch (exception) {
                plotErrorMessage(exception);
            }
        }
    };
    self.init = function () {
        plotLoading();
        return self;
    };
    return self;
};
var CSVDocument = function (url) {
    var self = {};
    self.build = function () {
        d3.csv(url, createBlips);
    };
    var createBlips = function (data) {
        try {
            var columnNames = data['columns'];
            delete data['columns'];
            var contentValidator = new contentValidator_1.default(columnNames);
            contentValidator.verifyContent();
            contentValidator.verifyHeaders();
            var blips = _.map(data, new inputSanitizer_1.default()).sanitize;
            plotRadar(FileName(url), blips);
        }
        catch (exception) {
            plotErrorMessage(exception);
        }
    };
    self.init = function () {
        plotLoading();
        return self;
    };
    return self;
};
var QueryParams = function (queryString) {
    var decode = function (s) {
        return decodeURIComponent(s.replace(/\+/g, " "));
    };
    var search = /([^&=]+)=?([^&]*)/g;
    var queryParams = {};
    var match;
    while (match = search.exec(queryString))
        queryParams[decode(match[1])] = decode(match[2]);
    return queryParams;
};
var DomainName = function (url) {
    var search = /.+:\/\/([^\/]+)/;
    var match = search.exec(decodeURIComponent(url.replace(/\+/g, " ")));
    return match == null ? null : match[1];
};
var FileName = function (url) {
    var search = /([^\/]+)$/;
    var match = search.exec(decodeURIComponent(url.replace(/\+/g, " ")));
    if (match != null) {
        return match[1];
    }
    return url;
};
var GoogleSheetInput = function () {
    var self = {};
    self.build = function () {
        var domainName = DomainName(window.location.search.substring(1));
        var queryParams = QueryParams(window.location.search.substring(1));
        if (domainName && queryParams.sheetId.endsWith('csv')) {
            var sheet = new CSVDocument(queryParams.sheetId);
            sheet.init().build();
        }
        else if (domainName && domainName.endsWith('google.com') && queryParams.sheetId) {
            var sheet = GoogleSheet(queryParams.sheetId, queryParams.sheetName);
            console.log(queryParams.sheetName);
            sheet.init().build();
        }
        else {
            var content = d3.select('body')
                .append('div')
                .attr('class', 'input-sheet');
            set_document_title();
            plotLogo(content);
            var bannerText = '<div><h1>Build a technology radar</h1><p>Once you\'ve <a href ="https://www.thoughtworks.com/radar/byor">created your Radar</a>, you can use this service' +
                ' to generate an <br />interactive version of your Technology Radar. Not sure how? <a href ="https://www.thoughtworks.com/radar/how-to-byor">Read this first.</a></p></div>';
            plotBanner(content, bannerText);
            plotForm(content);
            plotFooter(content);
        }
    };
    return self;
};
function set_document_title() {
    document.title = "Build your own Radar";
}
function plotLoading() {
    var content = d3.select('body')
        .append('div')
        .attr('class', 'loading')
        .append('div')
        .attr('class', 'input-sheet');
    set_document_title();
    plotLogo(content);
    var bannerText = '<h1>Building your radar...</h1><p>Your Technology Radar will be available in just a few seconds</p>';
    plotBanner(content, bannerText);
    plotFooter(content);
}
function plotLogo(content) {
    content.append('div')
        .attr('class', 'input-sheet__logo')
        .html('<a href="https://marketing.move.com"><img src="/images/MoveLogo.png"></a>');
}
function plotFooter(content) {
    content
        .append('div')
        .attr('id', 'footer')
        .append('div')
        .attr('class', 'footer-content')
        .append('p')
        .html('Based on technology developed by <a href="https://www.thoughtworks.com"> ThoughtWorks</a> and modified at <a href="https://marketing.move.com/">Move</a> ');
}
function plotBanner(content, text) {
    content.append('div')
        .attr('class', 'input-sheet__banner')
        .html(text);
}
function plotForm(content) {
    content.append('div')
        .attr('class', 'input-sheet__form')
        .append('p')
        .html('<strong>Enter the URL of your <a href="https://www.thoughtworks.com/radar/how-to-byor" target="_blank">published</a> Google Sheet or CSV file below…</strong>');
    var form = content.select('.input-sheet__form').append('form')
        .attr('method', 'get');
    form.append('input')
        .attr('type', 'text')
        .attr('name', 'sheetId')
        .attr('placeholder', "e.g. https://docs.google.com/spreadsheets/d/<\sheetid\> or hosted CSV file")
        .attr('required', '');
    form.append('button')
        .attr('type', 'submit')
        .append('a')
        .attr('class', 'button')
        .text('Build my radar');
    form.append('p').html("<a href='https://www.thoughtworks.com/radar/how-to-byor'>Need help?</a>");
}
function plotErrorMessage(exception) {
    d3.selectAll(".loading").remove();
    var message = 'Oops! It seems like there are some problems with loading your data. ';
    if (exception instanceof malformedDataError_1.default) {
        message = message.concat(exception.message);
    }
    else if (exception instanceof sheetNotFoundError_1.default) {
        message = exception.message;
    }
    else {
        console.error(exception);
    }
    message = message.concat('<br/>', 'Please check <a href="https://www.thoughtworks.com/radar/how-to-byor">FAQs</a> for possible solutions.');
    d3.select('body')
        .append('div')
        .attr('class', 'error-container')
        .append('div')
        .attr('class', 'error-container__message')
        .append('p')
        .html(message);
}
exports.default = GoogleSheetInput;
//# sourceMappingURL=factory.js.map