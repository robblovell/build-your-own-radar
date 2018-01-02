class RingCalculator {
    sequence:number[] = [0, 15, 10, 6, 5, 4, 4, 3, 1];
    numberOfRings:number = 3;
    maxRadius:number = 600;
    constructor(numberOfRings: number, maxRadius: number) {
        this.numberOfRings = numberOfRings;
        this.maxRadius = maxRadius
    }

    sum(length: any) {
        return this.sequence.slice(0, length + 1).reduce(function (previous, current) {
            return previous + current;
        }, 0);
    };

    getRadius(ring: any) {
        var total = this.sum(this.numberOfRings);
        var sum = this.sum(ring);
        const radius = this.maxRadius * sum / total

        return radius < 5 ? 5 : radius;
    }

    getMaxRadius() {
        return this.maxRadius;
    }
}

export default RingCalculator;