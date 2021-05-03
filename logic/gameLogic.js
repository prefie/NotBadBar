class Glass {
    constructor(name, ingredients=[], limit=3) { // TODO: добавить ограничение на вместимость
        this.name = name;
        this.ingredients = ingredients;
        this.limit = limit;
    }

    tryAddIngredient(ingredient) {
        if (this.ingredients.length < this.limit) {
            this.ingredients.push(ingredient);
            return true;
        }
        return false;
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
    constructor(id, patternGlass, time, price) {
        this.id = id;
        this.patternGlass = patternGlass;
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
    }

    chooseGlass(name) {
        this.glass = new Glass(name);
    }

    addIngredientInGlass(ingredient) {
        this.glass.tryAddIngredient(ingredient);
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
        this.ordersInProgress = [];
    }

    start() {
        // TODO: начинаем уровень
        this._timeout = setTimeout(this.end, this.time, this);
    }

    tryPassOrder(order) {
        if (order.status === "Not completed") {
            return false;
        }
        if (order.status === "Completed") {
            this.money += order.price;
        }
        this.ordersInProgress = this.ordersInProgress.filter(ord => ord.id !== order.id);
        if (this.orders.length === 0 && this.ordersInProgress.length === 0) {
            this.end(this);
        }
        return true;
    }

    end(bar) {
        // TODO: уровень завершился, что делаем?
        clearTimeout(bar._timeout);
    }

    tryGetNextOrder(order) {
        if (this.ordersInProgress.length < this.max_orders) {
            this.orders = this.orders.filter(ord => ord.id !== order.id);
            this.ordersInProgress.push(order);
            order.start();
            return true;
        }

        return false;
    }
}

// НИЖЕ НАШ ПЕРВЫЙ ТЕСТ ЛОГИКИ =)
/*const bar = new Bar([
    new Order(
        1,
        new Glass("1", [
            new Liquid("Vodka", 3, "white"),
            new Topping("Cherry", 5)
        ]),
        2000,
        10
    ),
        new Order(
            2,
            new Glass("2", [
                new Liquid("Vodka", 3, "white"),
                new Topping("Cherry", 5)
            ]),
            2000,
            10
        ),
        new Order(
            3,
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
console.log(bar.orders);
console.log(bar.ordersInProgress);
bar.tryGetNextOrder(order);
console.log(bar.orders);
order.chooseGlass("1");
order.addIngredientInGlass(new Liquid("Vodka", 3, "white"));
order.addIngredientInGlass(new Topping("Cherry", 5));
console.log(bar.ordersInProgress);
bar.tryPassOrder(order);
console.log(bar.ordersInProgress);

const order1 = bar.orders[0]
bar.tryGetNextOrder(order1);
console.log(bar.ordersInProgress);
order1.chooseGlass("2");
order1.addIngredientInGlass(new Liquid("Vodka", 3, "white"));
bar.tryPassOrder(order1);
console.log(bar.ordersInProgress);


setTimeout(function func() {
    const order2 = bar.orders[0]
    console.log(bar.orders);
    let flag = bar.tryGetNextOrder(order2);
    console.log(bar.ordersInProgress);
    if (flag) {
        order2.chooseGlass("3");
        order2.addIngredientInGlass(new Liquid("Vodka", 3, "white"));
        order2.addIngredientInGlass(new Topping("Cherry", 5));
        bar.tryPassOrder(order2);
    }
    else {
        setTimeout(func, 200)
    }
}, 200);

setTimeout(function () {
    console.log(bar.ordersInProgress);
    order1.addIngredientInGlass(new Topping("Cherry", 5));
    bar.tryPassOrder(order1);
    console.log(bar.ordersInProgress);
} , 1500);

setTimeout(() => console.log(bar.money), 6000);*/
