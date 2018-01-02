chai = require('chai')
expect = chai.expect
const InputSanitizer = require('../../src/util/inputSanitizer').default;

if (!before) {
    var before = function(beforeFunc) {
        beforeAll(beforeFunc)
    }
}
describe('InputSanitizer', function(){
    var sanitizer, rawBlip, blip;

    before(function(){
        sanitizer = new InputSanitizer();
        var description = "<b>Hello</b> <script>alert('dangerous');</script>there <h1>heading</h1>";
        rawBlip = {
            name: "Hello <script>alert('dangerous');</script>there <h1>blip</h1>",
            description: description,
            ring: '<a href="/asd">Adopt</a>',
            quadrant: '<strong>techniques & tools</strong>',
            isNew: 'true<br>'
        };

        blip = sanitizer.sanitize(rawBlip);
    });

    it('strips out script tags from blip descriptions', function(){
        expect(blip.description).equal("<b>Hello</b> there <h1>heading</h1>");
    });

    it('strips out all tags from blip name', function(){
        expect(blip.name).equal("Hello there blip");
    });

    it('strips out all tags from blip status', function(){
        expect(blip.isNew).equal("true");
    });

    it('strips out all tags from blip ring', function(){
        expect(blip.ring).equal("Adopt");
    });

    it('strips out all tags from blip quadrant', function(){
        expect(blip.quadrant).equal("techniques & tools");
    });

    it('trims white spaces in keys and values', function() {
      rawBlip = {
          ' name': '   Some name ',
          '   ring ': '    Some ring name ',
      };
      blip = sanitizer.sanitize(rawBlip);

      expect(blip.name).equal('Some name');
      expect(blip.ring).equal('Some ring name');
    });
});
