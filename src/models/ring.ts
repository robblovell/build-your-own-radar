const Ring = function (name, order):void {
  var self:any = {};

  self.name = function () {
    return name;
  };

  self.order = function () {
    return order;
  };

  return self;
};

export default Ring;
