const MalformedDataError = function(message):void {
  this.message=message;
};

(<any>Object).setPrototypeOf(MalformedDataError, Error);
MalformedDataError.prototype = Object.create(Error.prototype);
MalformedDataError.prototype.name = "MalformedDataError";
MalformedDataError.prototype.message = "";
MalformedDataError.prototype.constructor = MalformedDataError;

export default MalformedDataError;
