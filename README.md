[![Build Status](https://travis-ci.org/thoughtworks/build-your-own-radar.svg?branch=master)](https://travis-ci.org/thoughtworks/build-your-own-radar)

A library that generates an interactive radar, inspired by [thoughtworks.com/radar](http://thoughtworks.com/radar).

The format of the google docs sheet is different than the original thoughtworks radar in that there are follow on 
sheets that contain information defining the terms in the "name" column.  Instead of having one term per row
in the first sheet, a comma separated list of terms can be given in the names column. 

## Demo

You can see this version of the radar in action at https://radar.move.com. If you plug in [this data](https://docs.google.com/spreadsheets/d/1q11Dv2vz04UEvaEAAS4c4Cj36NVPUe1rLemNAT7lj4E/edit#gid=2082321659). 

## How To Use

The easiest way to use the app out of the box is to provide a *public* Google Sheet ID from which all the data will be fetched. 
You can enter that ID into the input field on the first page of the application, and your radar will be generated. 
The data must conform to the format below for the radar to be generated correctly.

### Setting up your data

You need to make your data public in a form we can digest.

Create a Google Sheet. On the first sheet Give it at least the below column headers, and put in the content that you want:

| quadrant               | name        | ring     |
|------------------------|-------------|----------|
| tools                  | Tech1,Tech2 | adopt    |
| techniques             | Tech3       | trial    |
| platforms              | Tech4       | assess   |
| languages & frameworks | Tech5,Tech6 | hold     |

You can specify between 2 and 8 quadrants and 2 to 6 rings

Define a sheet for each quadrant:

The "tools" sheet is for the tools quadrant. This will be a glossary of the things that are named for that quadrant.

| name        | isNew    | description
|-------------|----------|-------------------------------------------------|
| Tech1       | FALSE    | A thing's description, useful information here! |
| Tech2       | TRUE     | A thing's description, useful information here! |

Likewise, the "techniques" sheet is for the techniques quadrant. This will be a glossary of the things that are named for that quadrant.

| name        | isNew    | description
|-------------|----------|-------------------------------------------------|
| Tech3       | FALSE    | A thing's description, useful information here! |

and so on for the other sheets.

### Sharing the sheet

* In Google sheets, go to 'File', choose 'Publish to the web...' and then click 'Publish'.
* Close the 'Publish to the web' dialog.
* Copy the URL of your editable sheet from the browser (Don't worry, this does not share the editable version). 

The URL will be similar to [https://docs.google.com/spreadsheets/d/1q11Dv2vz04UEvaEAAS4c4Cj36NVPUe1rLemNAT7lj4E/edit](https://docs.google.com/spreadsheets/d/1q11Dv2vz04UEvaEAAS4c4Cj36NVPUe1rLemNAT7lj4E/edit). In theory we are only interested in the part between '/d/' and '/edit' but you can use the whole URL if you want.

### Using CSV data
The other way to provide your data is using CSV document format.
You can enter any URL that responds CSV data into the input field on the first page.
NOTE: IMPORTANT: The CSV format is just the same as that of the ORIGINAL ThoughtWorks format, the example is as follows:

```
name,ring,quadrant,isNew,description  
Composer,adopt,tools,TRUE,"Although the idea of dependency management ..."  
Canary builds,trial,techniques,FALSE,"Many projects have external code dependencies ..."  
Apache Kylin,assess,platforms,TRUE,"Apache Kylin is an open source analytics solution ..."  
JSF,hold,languages & frameworks,FALSE,"We continue to see teams run into trouble using JSF ..."  
```

Note: The CSV file parsing is using D3 library, so consult the D3 documentation for the data format details.

### Building the radar

Paste the URL in the input field on the home page.

That's it!

Note: the quadrants of the radar, and the order of the rings inside the radar will be drawn in the order they appear in your data.

### More complex usage

To create the data representation, you can use the Google Sheet [factory](/src/util/factory.js) or CSV, or you can also insert all your data straight into the code.

The app uses [Tabletop.js](https://github.com/jsoma/tabletop) to fetch the data from a Google Sheet or [D3.js](https://d3js.org/) if supplied as CSV, so refer to their documentation for more advanced interaction.  The input data is sanitized by whitelisting HTML tags with [sanitize-html](https://github.com/punkave/sanitize-html).

The application uses [webpack](https://webpack.github.io/) to package dependencies and minify all .js and .scss files.

## Contribute

All tasks are defined in `package.json`.

Note that this project has been converted to typescript but the webpack scripting has not yet been completed for the
javascript files to be kept out of the repository. Before checking in for a pull request, test with compiled typescript by
running "tsc" at the command line. You must have the typescript command line tool installed.

TODO: Pure typescript build using webpack.

Pull requests are welcome; please write tests whenever possible. 
Make sure you have nodejs installed.

- `git clone git@github.com:thoughtworks/build-your-own-radar.git`
- `npm install`
- `npm test` - to run your tests
- `npm run dev` - to run application in localhost:8080. This will watch the .js and .css files and rebuild on file changes

### Don't want to install node? Run with one line docker

     $ docker run -p 8080:8080 -v $PWD:/app -w /app -it node:7.3.0 /bin/sh -c 'npm install && npm run dev'

After building it will start on localhost:8080

TODO: docker build
TODO: jenkins build and deploy