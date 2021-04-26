const assert = require('assert');

/*import {Liquid, Topping, Order, Glass} from './/gameLogic.js';
*/

class Glass {
    constructor(name, ingredients=[]) { // TODO: добавить ограничение на вместимость
        this.name = name;
        this.ingredients = ingredients;
    }

    addIngredient(ingredient) {
        this.ingredients.push(ingredient);
    }

    clear() {
        this.ingredients = [];
    }

    change(name) {
        if (this.ingredients.length === 0)
            this.name = name;
    }

    equals(other) {
        return other instanceof Glass
            && this.name === other.name
            && this.ingredients.length === other.ingredients.length
            && this.ingredients.every((x, i) => x.equals(other.ingredients[i]));
    }
}

class Ingredient {
    constructor(name, price) {
        this.name = name;
        this.price = price;
    }

    equals(other) {
        return this.name === other.name && this.price === other.price;
    }
}

class Liquid extends Ingredient {
    constructor(name, price, color) {
        super(name, price);
        this.color = color;
    }
}

class Topping extends Ingredient {
    constructor(name, price) {
        super(name, price);
    }
}

class Order {
    constructor(pattern, time, price) {
        this.patternGlass = pattern;
        this.time = time;
        this.price = price;
        this.status = "Not completed";
    }

    start() {
        // TODO: начинаем выполнение заказа
        setTimeout(this.end, this.time, this);
    }

    end(order) {
        // TODO: заказ завершен, что делаем?
        if (order.status !== "Completed")
            order.status = "Fail";
        clearTimeout(order._timeout);
    }

    chooseGlass(name) {
        this.glass = new Glass(name);
    }

    addIngredientInGlass(ingredient) {
        this.glass.addIngredient(ingredient);
        this.tryPassOrder()
    }

    tryPassOrder() {
        if (this.status === "Fail")
            return false;

        const result = this.patternGlass.equals(this.glass);
        if (result)
            this.status = "Completed";
        return result;
    }
}

class Bar {
    constructor(orders, glasses, liquids, toppings, time) {
        this.orders = orders;
        this.glasses = glasses;
        this.liquids = liquids;
        this.toppings = toppings;
        this.time = time;

        this.max_orders = 2;
        this.money = 0;
        this.ordersInProgess = [];
    }

    start() {
        // TODO: начинаем уровень
        setTimeout(this.end, this.time, this);
        this._timeout = setTimeout(function func(bar) {
            Bar.passOrder(bar);
            bar._timeout = setTimeout(func, 300, bar)
        }, 300, this)
    }

    static passOrder(bar) {
        if (bar.ordersInProgess.length === 0)
            return;

        const answer = [];
        for (const order of bar.ordersInProgess) {
            if (order.status === "Completed") {
                bar.money += order.price;
            } else if (order.status === "Not completed") {
                answer.push(order);
            }
        }

        bar.ordersInProgess = answer;
        /*console.log(bar.ordersInProgess);
        console.log(answer);*/
    }

    end(bar) {
        // TODO: уровень завершился, что делаем?
        clearTimeout(bar._timeout);
    }

    tryGetNextOrder(order) {
        if (this.ordersInProgess.length < this.max_orders) {
            this.ordersInProgess.push(order);
            order.start();
            return true;
        }

        return false;
    }
}

it('правильный заказ', () => {
    let order = new Order(
        new Glass("1", [
            new Liquid("Vodka", 3, "white"),
            new Topping("Cherry", 5)
        ]),
        2000,
        10
    );
    order.chooseGlass("1");
    order.addIngredientInGlass(new Liquid("Vodka", 3, "white"));
    order.addIngredientInGlass(new Topping("Cherry", 5));
    assert.equal(order.tryPassOrder(), true);
});

it('неправильный стакан', () => {
    let order = new Order(
        new Glass("1", [
            new Liquid("Vodka", 3, "white"),
            new Topping("Cherry", 5)
        ]),
        2000,
        10
    );
    order.chooseGlass("2");
    order.addIngredientInGlass(new Liquid("Vodka", 3, "white"));
    order.addIngredientInGlass(new Topping("Cherry", 5));
    assert.equal(order.tryPassOrder(), false);
});

it('неправильная жидкость', () => {
    let order = new Order(
        new Glass("1", [
            new Liquid("Vodka", 3, "white"),
            new Topping("Cherry", 5)
        ]),
        2000,
        10
    );
    order.chooseGlass("1");
    order.addIngredientInGlass(new Liquid("Wine", 3, "white"));
    order.addIngredientInGlass(new Topping("Cherry", 5));
    assert.equal(order.tryPassOrder(), false);
});

it('неправильный топпинг', () => {
    let order = new Order(
        new Glass("1", [
            new Liquid("Vodka", 3, "white"),
            new Topping("Cherry", 5)
        ]),
        2000,
        10
    );
    order.chooseGlass("1");
    order.addIngredientInGlass(new Liquid("Vodka", 3, "white"));
    order.addIngredientInGlass(new Topping("Lime", 5));
    assert.equal(order.tryPassOrder(), false);
});



it('начисляется сумма заказа', () => {
    const bar = new Bar([
            new Order(
                new Glass("1", [
                    new Liquid("Vodka", 3, "white"),
                    new Topping("Cherry", 5)
                ]),
                2000,
                10
            ),
            new Order(
                new Glass("2", [
                    new Liquid("Vodka", 3, "white"),
                    new Topping("Cherry", 5)
                ]),
                2000,
                10
            ),
            new Order(
                new Glass("3", [
                    new Liquid("Vodka", 3, "white"),
                    new Topping("Cherry", 5)
                ]),
                2000,
                10
            )
        ], ["1", "2", "3"],
        ["Vodka", "Wine"],
        ["Cherry", "Lime"],
        6000);

    bar.start();
    const order = bar.orders[0];
    bar.tryGetNextOrder(order);
    order.chooseGlass("1");
    order.addIngredientInGlass(new Liquid("Vodka", 3, "white"));
    order.addIngredientInGlass(new Topping("Cherry", 5));

    setTimeout(() => assert.equal(bar.money, 10), 6000);
});

it('закончилось время выполнения заказа', () => {
    const bar = new Bar([
            new Order(
                new Glass("1", [
                    new Liquid("Vodka", 3, "white"),
                    new Topping("Cherry", 5)
                ]),
                2000,
                10
            )
        ], ["1", "2", "3"],
        ["Vodka", "Wine"],
        ["Cherry", "Lime"],
        6000);

    bar.start();
    const order = bar.orders[0];
    bar.tryGetNextOrder(order);
    order.chooseGlass("1");
    order.addIngredientInGlass(new Liquid("Vodka", 3, "white"));
    setTimeout(() => order.addIngredientInGlass(new Topping("Cherry", 5)), 3000);
    setTimeout(() => assert.equal(bar.money, 0), 5000);
});

it('level end before order done', () => {
    const bar = new Bar([
            new Order(
                new Glass("1", [
                    new Liquid("Vodka", 3, "white"),
                    new Topping("Cherry", 5)
                ]),
                2000,
                10
            ),
            new Order(
                new Glass("2", [
                    new Liquid("Vodka", 3, "white"),
                    new Topping("Cherry", 5)
                ]),
                2000,
                10
            ),
            new Order(
                new Glass("3", [
                    new Liquid("Vodka", 3, "white"),
                    new Topping("Cherry", 5)
                ]),
                2000,
                10
            )
        ], ["1", "2", "3"],
        ["Vodka", "Wine"],
        ["Cherry", "Lime"],
        6000);

    bar.start();
    const order = bar.orders[0];
    bar.tryGetNextOrder(order);
    order.chooseGlass("1");
    order.addIngredientInGlass(new Liquid("Vodka", 3, "white"));
    setTimeout(() => console.log("wait"), 9000);
    order.addIngredientInGlass(new Topping("Cherry", 5));
    assert.equal(bar.money, 0);
});