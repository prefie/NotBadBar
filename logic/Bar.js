import {Order} from './Order.js';
import {Glass} from './Glass.js';
import {Liquid, Topping} from './Ingredient.js';

export class Bar {
    constructor(orders, glasses, liquids, toppings, time, levelTarget, maxOrders = 2) {
        this.orders = orders;
        this.glasses = glasses;
        this.liquids = liquids;
        this.toppings = toppings;
        this.time = time;
        this.levelTarget = levelTarget; // минимум сколько должны заработать
        this.status = 'Not started';

        this.maxOrders = maxOrders;
        this.money = 0;
        this.ordersInProgress = [];
    }

    start() {
        this.status = 'Started';
        this._timeout = setTimeout(this.end, this.time, this);
    }

    tryPassOrder(order) {
        if (order.status === 'Not completed') {
            return false;
        }
        if (order.status === 'Completed') {
            this.money += order.price;
        }

        this.filter()

        return order.status !== 'Fail';

    }

    filter() {
        this.ordersInProgress = this.ordersInProgress.filter(ord => ord.status === 'Not completed');
        if (this.orders.length === 0 && this.ordersInProgress.length === 0) {
            this.end(this);
        }
    }

    end(bar) {
        if (this.money < this.levelTarget) {
            this.status = 'Fail';
        } else {
            this.status = 'Win';
        }
        clearTimeout(bar._timeout);
    }

    tryGetNextOrder(order) {
        if (this.ordersInProgress.length < this.maxOrders) {
            this.orders = this.orders.filter(ord => ord.id !== order.id);
            this.ordersInProgress.push(order);
            order.start();
            return true;
        }

        return false;
    }
}

export function generateOrder(maxLayers, toppingExist, id, timeForLayer) {
    const glass = glasses[Math.floor(Math.random() * glasses.length)];
    const layers = [];
    let sum = 0;
    const layersCount = Math.floor(Math.random() * maxLayers) + 1;
    for (let i = 0; i < layersCount; i++) {
        const l = liquids[Math.floor(Math.random() * liquids.length)];
        layers.push(l);
        sum += l.price;
    }
    if (toppingExist) {
        const randomTopping = toppings[Math.floor(Math.random() * toppings.length)];
        sum += randomTopping.price;
        return new Order(
            id,
            new Glass(glass, layers.length, layers, randomTopping),
            (layers.length + 1) * timeForLayer, sum * 2);
    }
    return new Order(
        id,
        new Glass(glass, layers.length, layers),
        layers.length * timeForLayer, sum * 2);
}

export function generateBar(ordersCount, maxLayers, levelTarget, timeLevel, maxOrders, timeForLayer) {
    const orders = [];
    for (let i = 0; i < ordersCount; i++) {
        const order = generateOrder(maxLayers, Math.random() > 0.5, i, timeForLayer);
        orders.push(order);
    }

    return new Bar(orders, glasses, liquids, toppings, timeLevel, levelTarget, maxOrders);
}

export const glasses = [
    'water-glass',
    'short-glass',
    'tall-glass',
    'round-glass'
];

export const liquids = [
    new Liquid('Absinthe', 4, 'limegreen'),
    new Liquid('Aperol', 5, 'orange'),
    new Liquid('Blue-Curasao', 7, 'blue'),
    new Liquid('Bombay-Sapphire', 9, 'lightskyblue'),
    new Liquid('Campari', 7, 'red')
];

export const toppings = [
    new Topping('Lime', 10),
    new Topping('Cherry', 10),
    new Topping('Olive', 5),
    new Topping('Strawberry', 8)
];
