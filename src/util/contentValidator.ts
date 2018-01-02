import * as _ from "lodash";

import MalformedDataError from "../../src/exceptions/malformedDataError";

import ExceptionMessages from "./exceptionMessages";

const ContentValidator = function (columnNames):void {
  var self:any = {};
  columnNames = columnNames.map(function(columnName) {
    return columnName.trim();
  });

  self.verifyContent = function() {
    if(columnNames.length == 0){
      throw new MalformedDataError(ExceptionMessages.MISSING_CONTENT);
    }
  };

  self.verifyHeaders = function() {
    _.each(['name', 'ring', 'quadrant'], function (field) {
      if (columnNames.indexOf(field) == -1) {
        throw new MalformedDataError(ExceptionMessages.MISSING_HEADERS);
      }
    });
  };

  return self;
};

export default ContentValidator;

