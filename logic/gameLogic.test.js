import {Bar} from './Bar.js';
import {Glass} from './Glass.js';
import {Order} from './Order.js';
import {Liquid, Topping} from './Ingredient.js';

test('правильный заказ', () => {
    let order = new Order(
        1, new Glass('1', 2, [
                new Liquid('Vodka', 3, 'white')],
            new Topping('Cherry', 5)
        ),
        2000,
        10
    );
    order.chooseGlass('1');
    order.addIngredientInGlass(new Liquid('Vodka', 3, 'white'));
    order.addIngredientInGlass(new Topping('Cherry', 5));
    expect(order.status).toBe('Completed');
});

test('ограничение на вместимость жидкости в стакане', () => {
    let order = new Order(
        1, new Glass('1', 1, [
                new Liquid('Vodka', 3, 'white')],
            new Topping('Cherry', 5)
        ),
        2000,
        10
    );
    order.chooseGlass('1', 1);
    order.addIngredientInGlass(new Liquid('Vodka', 3, 'white'));
    order.addIngredientInGlass(new Liquid('Water', 3, 'no'));
    order.addIngredientInGlass(new Topping('Cherry', 5));
    order.addIngredientInGlass(new Topping('Banana', 5));
    expect(order.glass.liquids.length).toBe(1);
});

test('ограничение на вместимость топпингов в стакане', () => {
    let order = new Order(
        1, new Glass('1', 1, [
                new Liquid('Vodka', 3, 'white')],
            new Topping('Cherry', 5)
        ),
        2000,
        10
    );
    order.chooseGlass('1', 1);
    order.addIngredientInGlass(new Liquid('Vodka', 3, 'white'));
    order.addIngredientInGlass(new Topping('Cherry', 5));
    order.addIngredientInGlass(new Topping('Banana', 5));

    expect(order.glass.topping.name).toBe('Cherry');
});

test('смена стакана', () => {
    let order = new Order(
        1, new Glass('1', 1, [
                new Liquid('Vodka', 3, 'white')],
            new Topping('Cherry', 5)
        ),
        2000,
        10
    );
    order.chooseGlass('2');
    order.chooseGlass('1');
    order.addIngredientInGlass(new Liquid('Vodka', 3, 'white'));
    order.addIngredientInGlass(new Topping('Cherry', 5));
    expect(order.status).toBe('Completed');
});

test('начать заказ заново', () => {
    let order = new Order(
        1, new Glass('1', [
                new Liquid('Vodka', 3, 'white')],
            new Topping('Cherry', 5)
        ),
        2000,
        10
    );
    order.chooseGlass('1');
    order.addIngredientInGlass(new Liquid('Water', 3, 'white'));
    order.addIngredientInGlass(new Topping('Cherry', 5));
    order.addIngredientInGlass(new Topping('Lime', 5));
    order.glass.clear();
    expect(order.glass.liquids.length).toBe(0);
    expect(order.glass.topping).toBe(null);
});

test('неправильный стакан', () => {
    let order = new Order(
        1, new Glass('1', [
                new Liquid('Vodka', 3, 'white')],
            new Topping('Cherry', 5)
        ),
        2000,
        10
    );
    order.chooseGlass('2');
    order.addIngredientInGlass(new Liquid('Vodka', 3, 'white'));
    order.addIngredientInGlass(new Topping('Cherry', 5));
    expect(order.tryPassOrder()).toBe(false);
});

test('неправильная жидкость', () => {
    let order = new Order(
        1, new Glass('1', [
                new Liquid('Vodka', 3, 'white')],
            new Topping('Cherry', 5)
        ),
        2000,
        10
    );
    order.chooseGlass('1');
    order.addIngredientInGlass(new Liquid('Wine', 3, 'white'));
    order.addIngredientInGlass(new Topping('Cherry', 5));
    expect(order.tryPassOrder()).toBe(false);
});

test('неправильный топпинг', () => {
    let order = new Order(
        1, new Glass('1', [
                new Liquid('Vodka', 3, 'white')],
            new Topping('Cherry', 5)
        ),
        2000,
        10
    );
    order.chooseGlass('1');
    order.addIngredientInGlass(new Liquid('Vodka', 3, 'white'));
    order.addIngredientInGlass(new Topping('Lime', 5));
    expect(order.tryPassOrder()).toBe(false);
});


test('начисляется сумма заказа', () => {
    const bar = new Bar([
            new Order(
                1, new Glass('1', [
                        new Liquid('Vodka', 3, 'white')],
                    new Topping('Cherry', 5)
                ),
                2000,
                10
            ),
            new Order(
                2, new Glass('2', [
                        new Liquid('Vodka', 3, 'white')],
                    new Topping('Cherry', 5)
                ),
                2000,
                10
            ),
            new Order(
                3, new Glass('3', [
                        new Liquid('Vodka', 3, 'white')],
                    new Topping('Cherry', 5)
                ),
                2000,
                10
            )
        ], ['1', '2', '3'],
        ['Vodka', 'Wine'],
        ['Cherry', 'Lime'],
        6000);

    bar.start();
    const order = bar.orders[0];
    bar.tryGetNextOrder(order);
    order.chooseGlass('1');
    order.addIngredientInGlass(new Liquid('Vodka', 3, 'white'));
    order.addIngredientInGlass(new Topping('Cherry', 5));

    setTimeout(() => expect(bar.money).toBe(10), 6000);
});

test('закончилось время выполнения заказа', () => {
    const bar = new Bar([
            new Order(
                1, new Glass('1', [
                        new Liquid('Vodka', 3, 'white')],
                    new Topping('Cherry', 5)
                ),
                2000,
                10
            )
        ], ['1', '2', '3'],
        ['Vodka', 'Wine'],
        ['Cherry', 'Lime'],
        6000);

    bar.start();
    const order = bar.orders[0];
    bar.tryGetNextOrder(order);
    order.chooseGlass('1');
    order.addIngredientInGlass(new Liquid('Vodka', 3, 'white'));
    setTimeout(() => order.addIngredientInGlass(new Topping('Cherry', 5)), 3000);
    setTimeout(() => expect(bar.money).toBe(0), 5000);
});

test('level end before order done', () => {
    const bar = new Bar([
            new Order(
                1, new Glass('1', [
                        new Liquid('Vodka', 3, 'white')],
                    new Topping('Cherry', 5)
                ),
                2000,
                10
            ),
            new Order(
                2, new Glass('2', [
                        new Liquid('Vodka', 3, 'white')],
                    new Topping('Cherry', 5)
                ),
                2000,
                10
            ),
            new Order(
                3, new Glass('3', [
                        new Liquid('Vodka', 3, 'white')],
                    new Topping('Cherry', 5)
                ),
                2000,
                10
            )
        ], ['1', '2', '3'],
        ['Vodka', 'Wine'],
        ['Cherry', 'Lime'],
        6000);

    bar.start();
    const order = bar.orders[0];
    bar.tryGetNextOrder(order);
    order.chooseGlass('1');
    order.addIngredientInGlass(new Liquid('Vodka', 3, 'white'));
    setTimeout(() => console.log('wait'), 9000);
    order.addIngredientInGlass(new Topping('Cherry', 5));
    expect(bar.money).toBe(0);
});