const Quadrant = function (name:string):void {
  var self:any, blips:any;

  self = {};
  blips = [];

  self.name = function () {
    return name;
  };

  self.add = function (newBlips:any) {
    if (Array.isArray(newBlips)) {
      blips = blips.concat(newBlips);
    } else {
      blips.push(newBlips);
    }
  };

  self.blips = function () {
    return blips.slice(0);
  };

  return self;
};

export default Quadrant;