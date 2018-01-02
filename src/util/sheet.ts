import SheetNotFoundError from "../../src/exceptions/sheetNotFoundError";
import ExceptionMessages from "./exceptionMessages";
class Sheet {
    sheetReference: any = {};
    id:number = 0;

    constructor(sheetReference: any) {
        this.sheetReference = sheetReference;

        const matches = this.sheetReference.match("https:\\/\\/docs.google.com\\/spreadsheets\\/d\\/(.*?)($|\\/$|\\/.*|\\?.*)");
        this.id = matches !== null ? matches[1] : this.sheetReference;
    }

    exists(callback:any) {
        const feedURL = "https://spreadsheets.google.com/feeds/worksheets/" + this.id + "/public/basic?alt=json";

        // TODO: Move this out (as HTTPClient)
        const xhr = new XMLHttpRequest();
        xhr.open('GET', feedURL, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    return callback();
                } else {
                    return callback(new SheetNotFoundError(ExceptionMessages.SHEET_NOT_FOUND));
                }
            }
        };
        xhr.send(null);
    };
}

export default Sheet;
