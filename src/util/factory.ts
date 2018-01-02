import * as d3 from "d3"
import ExceptionMessages from "./exceptionMessages";
import Sheet from "./sheet";
import ContentValidator from "./contentValidator";
import SheetNotFoundError from "../exceptions/sheetNotFoundError";
import MalformedDataError from "../exceptions/malformedDataError";
import GraphingRadar from "../graphing/radar";
import Blip from "../models/blip";
import Ring from "../models/ring";
import Quadrant from "../models/quadrant";
import Radar from "../models/radar";
import InputSanitizer from "./inputSanitizer";
// import lodash012 from "lodash/each";
// import lodash01 from "lodash/capitalize";
// import lodash0 from "lodash/uniqBy";
// import lodash from "lodash/map";
import * as _ from "lodash";
import config from "../config/config";
import * as Tabletop from "tabletop";

// const _ = {
//     map: lodash,
//     uniqBy: lodash0,
//     capitalize: lodash01,
//     each: lodash012,
// };

const plotRadar = function (title, blips): void {
    document.title = title;
    d3.selectAll(".loading").remove();

    let rings = _.map(_.uniqBy(blips, 'ring'), 'ring');
    let ringMap = {};
    let maxRings = config.maxRings;
    let numRings = 0;

    _.each(rings, function (ringName, i) {
        if (i == maxRings) {
            throw new MalformedDataError(ExceptionMessages.TOO_MANY_RINGS(config.maxRings));
        }
        if (i > numRings) { numRings = i }
        ringMap[ringName] = new Ring(ringName, i);
    });

    let quadrants = {};
    _.each(blips, function (blip) {
        if (!quadrants[blip.quadrant]) {
            quadrants[blip.quadrant] = new Quadrant(_.capitalize(blip.quadrant));
        }
        quadrants[blip.quadrant].add(new Blip(blip.name, ringMap[blip.ring], blip.isNew.toLowerCase() === 'true', blip.topic, blip.description))
    });

    const numQuadrants = _.keys(quadrants).length

    let radar = new Radar(numQuadrants, numRings);
    _.each(quadrants, function (quadrant) {
        radar.addQuadrant(quadrant)
    });

    let size = (window.innerWidth - 133) < 350 ? 350 : window.innerWidth - 133;
    console.log(size)
    console.log(window.innerWidth)
    if (size > 600) { size = 600 }

    new GraphingRadar(size, radar).init().plot();
}

const GoogleSheet = function (sheetReference, sheetName): void {
    let self: any = {};

    self.build = function () {
        let sheet: any = new Sheet(sheetReference);
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
            const sanatizer = new InputSanitizer()
            let blips = []
            _.forEach(radarSheet, (row) => { // create multiple rows based on the names and glossary entries
                let names = row['name'].split(',');
                names = _.map(names, name => name.trim())
                console.log("names: "+JSON.stringify(names));
                _.map(names, (name) => {
                    let details = glossarySheets[row.quadrant].find((element) => element.name === name)
                    console.log("name: "+name+"  Details: "+JSON.stringify(details))
                    blips.push(sanatizer.sanitize({
                        name: name,
                        ring: row.ring,
                        quadrant: row.quadrant,
                        isNew: details && details.isNew?details.isNew:"not found",
                        description: details && details.description?details.description:"glossary entry missing",
                    }))
                })
            });
            // console.log("Blips: "+JSON.stringify(blips))
            return blips

        }
        function createBlips(__, tabletop) {
            try {
                if (!sheetName) {
                    sheetName = tabletop.foundSheetNames[0].trim();
                }
                let columnNames = tabletop.sheets(sheetName).columnNames;

                let contentValidator = new ContentValidator(columnNames);
                contentValidator.verifyContent();
                contentValidator.verifyHeaders();

                let all = tabletop.sheets(sheetName).all();
                // let blips = _.map(all, new InputSanitizer().sanitize);

                let quadrantNames = _.map(all, (row) => { return row.quadrant.trim() })
                // get the unique quadrant names so that the glossary sheets can be imported.
                quadrantNames = _.uniq(quadrantNames)

                // console.log("All: "+JSON.stringify(all))
                // console.log("Columns: "+JSON.stringify(columnNames))
                // console.log("Quadrants: "+JSON.stringify(quadrantNames))
                const glossarySheets = {}
                _.forEach(quadrantNames, (sheetName) => {
                    // console.log("Sheet: "+sheetName)
                    glossarySheets[sheetName] = tabletop.sheets(sheetName).all()
                    // console.log("Sheet: "+JSON.stringify(glossarySheets[sheetName]))
                })
                const blips = createRadar(all, glossarySheets)
                plotRadar(tabletop.googleSheetName, blips);
            } catch (exception) {
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

const CSVDocument = function (url): void {
    let self: any = {};

    self.build = function () {
        d3.csv(url, createBlips);
    }

    let createBlips = function (data) {
        try {
            let columnNames = data['columns'];
            delete data['columns'];
            let contentValidator = new ContentValidator(columnNames);
            contentValidator.verifyContent();
            contentValidator.verifyHeaders();
            let blips = _.map(data, new InputSanitizer().sanitize);
            plotRadar(FileName(url), blips);
        } catch (exception) {
            plotErrorMessage(exception);
        }
    }

    self.init = function () {
        plotLoading();
        return self;
    };

    return self;
};

const QueryParams = function (queryString) {
    let decode = function (s) {
        return decodeURIComponent(s.replace(/\+/g, " "));
    };

    let search = /([^&=]+)=?([^&]*)/g;

    let queryParams = {};
    let match;
    while (match = search.exec(queryString))
        queryParams[decode(match[1])] = decode(match[2]);

    return queryParams
};

const DomainName = function (url) {
    let search = /.+:\/\/([^\/]+)/;
    let match = search.exec(decodeURIComponent(url.replace(/\+/g, " ")));
    return match == null ? null : match[1];
}

const FileName = function (url) {
    let search = /([^\/]+)$/;
    let match = search.exec(decodeURIComponent(url.replace(/\+/g, " ")));
    if (match != null) {
        let str = match[1];
        return str;
    }
    return url;
}

const GoogleSheetInput = function (): void {
    let self: any = {};

    self.build = function () {
        let domainName: any = DomainName(window.location.search.substring(1));
        let queryParams: any = QueryParams(window.location.search.substring(1));

        if (domainName && queryParams.sheetId.endsWith('csv')) {
            let sheet = new CSVDocument(queryParams.sheetId);
            sheet.init().build();
        }
        else if (domainName && domainName.endsWith('google.com') && queryParams.sheetId) {
            let sheet = new GoogleSheet(queryParams.sheetId, queryParams.sheetName);
            console.log(queryParams.sheetName)

            sheet.init().build();
        } else {
            let content = d3.select('body')
                .append('div')
                .attr('class', 'input-sheet');
            set_document_title();

            plotLogo(content);

            let bannerText = '<div><h1>Build a technology radar</h1><p>Once you\'ve <a href ="https://www.thoughtworks.com/radar/byor">created your Radar</a>, you can use this service' +
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
    let content = d3.select('body')
        .append('div')
        .attr('class', 'loading')
        .append('div')
        .attr('class', 'input-sheet');

    set_document_title();

    plotLogo(content);

    let bannerText = '<h1>Building your radar...</h1><p>Your Technology Radar will be available in just a few seconds</p>';
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
        .html('Based on technology developed by <a href="https://www.thoughtworks.com"> ThoughtWorks</a> and modified at <a href="https://marketing.move.com/">Move</a> '
           );
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

    let form = content.select('.input-sheet__form').append('form')
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
    let message = 'Oops! It seems like there are some problems with loading your data. ';

    if (exception instanceof MalformedDataError) {
        message = message.concat(exception.message);
    } else if (exception instanceof SheetNotFoundError) {
        message = exception.message;
    } else {
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

export default GoogleSheetInput;
