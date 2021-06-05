import { Topping } from './Ingredient.js'

export class Glass {
    constructor(name, limit=3, liquids=[], topping=null) {
        this.name = name;
        this.liquids = liquids;
        this.topping = topping;
        this.limit = limit;
    }

    tryAddIngredient(ingredient) {
        if (ingredient instanceof Topping) {
            if (this.topping === null) {
                this.topping = ingredient;
                return true;
            }
            return false;
        }

        if (this.liquids.length < this.limit) {
            this.liquids.push(ingredient);
            return true;
        }
        return false;
    }

    clear() {
        this.liquids = [];
        this.topping = null;
    }

    change(name) { // нужен ли?
        if (this.liquids.length === 0)
            this.name = name;
    }

    equals(other) {
        return other instanceof Glass
            && this.name === other.name
            && this.liquids.length === other.liquids.length
            && this.liquids.every((x, i) => x.equals(other.liquids[i]))
            && (this.topping !== null && this.topping.equals(other.topping)
            || this.topping === other.topping && this.topping === null);
    }
}

/*module.exports = { Glass };*/

