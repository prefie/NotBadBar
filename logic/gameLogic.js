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
        this._timeout = setTimeout(function func(order) {
            Order.tryPassOrder(order);
            order._timeout = setTimeout(func, 300, order);
        }, 300, this);
        /*this._interval = setInterval(this.tryPassOrder, 300, this)*/
    }

    end(order) {
        // TODO: заказ завершен, что делаем?
        if (order.status !== "Completed")
            order.status = "Fail";
        clearTimeout(order._timeout);
        /*clearInterval(order._interval);*/
    }

    chooseGlass(name) {
        this.glass = new Glass(name);
    }

    static tryPassOrder(order) {
        if (order.status === "Fail")
            return false;

        const result = order.patternGlass.equals(order.glass);
        if (result)
            order.status = "Completed";
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
        /*this._interval = setInterval(this.passOrder, 300, this);*/
    }

    static passOrder(bar) {
        if (bar.ordersInProgess.length === 0)
            return;

        const answer = [];
        for (const order of bar.ordersInProgess) {
            if (order.status === "Completed") {
                bar.money += order.price;
            } else {
                answer.push(order);
            }
        }

        bar.ordersInProgess = answer;
        console.log(bar.ordersInProgess);
        console.log(answer);
    }

    end(bar) {
        // TODO: уровень завершился, что делаем?
        clearTimeout(bar._timeout);
        /*clearInterval(bar._interval);*/
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

// НИЖЕ НАШ ПЕРВЫЙ ТЕСТ ЛОГИКИ =)
/*const bar = new Bar([
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
order.glass.addIngredient(new Liquid("Vodka", 3, "white"));
order.glass.addIngredient(new Topping("Cherry", 5));

const order1 = bar.orders[1]
bar.tryGetNextOrder(order1);
order1.chooseGlass("2");
order1.glass.addIngredient(new Liquid("Vodka", 3, "white"));
order1.glass.addIngredient(new Topping("Cherry", 5));


setTimeout(function func() {
    const order2 = bar.orders[2]
    let flag = bar.tryGetNextOrder(order2);
    if (flag) {
        order2.chooseGlass("3");
        order2.glass.addIngredient(new Liquid("Vodka", 3, "white"));
        order2.glass.addIngredient(new Topping("Cherry", 5));
    }
    else {
        setTimeout(func, 200)
    }
}, 200)

setTimeout(() => console.log(bar.money), 6000);*/
