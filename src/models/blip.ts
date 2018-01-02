const IDEAL_BLIP_WIDTH = 22;

class Blip {
    width:number = IDEAL_BLIP_WIDTH;
    _number:number = -1;
    _name:string="";
    _isNew:boolean=false;
    _topic:string="";
    _description:string="";
    _ring:any;

    constructor(name: string, ring: string, isNew: boolean, topic: string, description: string) {
        this._name = name;
        this._isNew = isNew;
        this._topic = topic;
        this._description = description;
        this._ring = ring;
    }

    name() {
        return this._name;
    };

    topic() {
        return this._topic || '';
    };

    description () {
        return this._description || '';
    };

    isNew () {
        return this._isNew;
    };

    ring() {
        return this._ring;
    };

    number()  {
        return this._number;
    };

    setNumber  (newNumber: number) {
        this._number = newNumber;
    };
}
export default Blip;
