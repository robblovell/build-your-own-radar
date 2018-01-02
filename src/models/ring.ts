class Ring {
    aname: string;
    aorder: number;

    constructor(name: any="", order: any=1) {
        this.aname = name;
        this.aorder = order;
    }

    name() {
        return this.aname;
    };

    order() {
        return this.aorder;
    };

}
export default Ring;
