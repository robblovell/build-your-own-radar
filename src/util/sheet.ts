import SheetNotFoundError from "../../src/exceptions/sheetNotFoundError";
import ExceptionMessages from "./exceptionMessages";

const Sheet = function (sheetReference):void {
    var self:any = {};

    (function () {
        var matches = sheetReference.match("https:\\/\\/docs.google.com\\/spreadsheets\\/d\\/(.*?)($|\\/$|\\/.*|\\?.*)");
        self.id = matches !== null ? matches[1] : sheetReference;
    })();

    self.exists = function (callback) {
        var feedURL = "https://spreadsheets.google.com/feeds/worksheets/" + self.id + "/public/basic?alt=json";

        // TODO: Move this out (as HTTPClient)
        var xhr = new XMLHttpRequest();
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

    return self;
};
export default Sheet;
