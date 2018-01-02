chai = require('chai');
expect = chai.expect
should = chai.should()
assert = chai.assert

const ContentValidator = require('../../src/util/contentValidator').default;
const MalformedDataError = require('../../src/exceptions/malformedDataError').default;
const ExceptionMessages = require('../../src/util/exceptionMessages').default;

describe('ContentValidator', function () {

  describe('verifyContent', function () {
    it('does not return anything if content is valid', function () {
      var columnNames = ["name", "ring", "quadrant", "isNew", "description"];
      var contentValidator = new ContentValidator(columnNames);

      assert.isUndefined(contentValidator.verifyContent());
    });

    it('raises an error if content is empty', function () {
      var columnNames = [];
      var contentValidator = new ContentValidator(columnNames);

      expect(function () {
        contentValidator.verifyContent()
      }).to.throw(); //new MalformedDataError(ExceptionMessages.MISSING_CONTENT));
    });
  });

  describe('verifyHeaders', function () {

    it('raises an error if one of the headers is empty', function () {
      var columnNames = ['ring', 'quadrant', 'isNew', 'description'];
      var contentValidator = new ContentValidator(columnNames);

      expect(function () {
        contentValidator.verifyHeaders()
      }).to.throw(); //new MalformedDataError(ExceptionMessages.MISSING_HEADERS));
    });

    it('does not return anything if the all required headers are present', function () {
      var columnNames = ['name', 'ring', 'quadrant', 'isNew', 'description'];
      var contentValidator = new ContentValidator(columnNames);

      assert.isUndefined(contentValidator.verifyHeaders());
    });

    it('does not care about white spaces in the headers', function() {
      var columnNames = [' name', 'ring ', '   quadrant', 'isNew   ', '   description   '];
      var contentValidator = new ContentValidator(columnNames);

      assert.isUndefined(contentValidator.verifyHeaders());
    });

  });
});
