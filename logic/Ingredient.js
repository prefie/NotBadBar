class Ingredient {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }

    equals(other) {
        return this.name === other.name && this.price === other.price;
    }
}

export class Liquid extends Ingredient {
    constructor(name, price, color='red') {
        super(name, price);
        this.color = color;
    }
}

export class Topping extends Ingredient {
    constructor(name, price) {
        super(name, price);
    }
}

/*module.exports = { Ingredient, Liquid, Topping };*/
