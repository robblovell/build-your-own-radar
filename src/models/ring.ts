class Ring {
    _name: string = "";
    _order: number = 0;

    constructor(name: any, order: any) {
        this._name = name;
        this._order = order;
    }

    name() {
        return this._name;
    };

    order() {
        return this._order;
    };

};
export default Ring;
