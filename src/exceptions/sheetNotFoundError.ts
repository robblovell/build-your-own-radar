const SheetNotFoundError = function(message):void {
    this.message=message;
};

(<any>Object).setPrototypeOf(SheetNotFoundError, Error);
SheetNotFoundError.prototype = Object.create(Error.prototype);
SheetNotFoundError.prototype.name = "SheetNotFoundError";
SheetNotFoundError.prototype.message = "";
SheetNotFoundError.prototype.constructor = SheetNotFoundError;

export default SheetNotFoundError;
