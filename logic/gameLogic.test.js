const { Liquid,
    Topping, Order, Glass, Bar } = require('./gameLogic');

test('правильный заказ', () => {
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
    expect(order.tryPassOrder()).toBe(true);
});

test('неправильный стакан', () => {
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
    expect(order.tryPassOrder()).toBe(false);
});

test('неправильная жидкость', () => {
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
    expect(order.tryPassOrder()).toBe(false);
});

test('неправильный топпинг', () => {
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
    expect(order.tryPassOrder()).toBe(false);
});



test('начисляется сумма заказа', () => {
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

    setTimeout(() => expect(bar.money).toBe(10), 6000);
});

test('закончилось время выполнения заказа', () => {
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
    setTimeout(() => expect(bar.money).toBe(0), 5000);
});

test('level end before order done', () => {
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
    expect(bar.money).toBe(0);
});