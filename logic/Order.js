import {Glass} from './Glass.js';

export class Order {
    constructor(id, patternGlass, time, price) {
        this.id = id;
        this.patternGlass = patternGlass;
        this.time = time;
        this.price = price;
        this.status = 'Not completed';
    }

    start() {
        setTimeout(this.end, this.time, this);
    }

    end(order) {
        if (order.status !== 'Completed')
            order.status = 'Fail';
    }

    chooseGlass(name, limit) {
        this.glass = new Glass(name, limit);
    }

    addIngredientInGlass(ingredient) {
        this.glass.tryAddIngredient(ingredient);
        this.tryPassOrder();
    }

    tryPassOrder() {
        if (this.status === 'Fail')
            return false;

        const result = this.patternGlass.equals(this.glass);
        if (result)
            this.status = 'Completed';
        return result;
    }
}
