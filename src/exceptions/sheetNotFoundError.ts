class SheetNotFoundError {
    message:string = "";
    constructor(message:string) {
        this.message = message;
    }
}

export default SheetNotFoundError;
