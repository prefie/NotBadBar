import {glasses, liquids, toppings} from '../visualisation/js/config';
import {Order} from './Order';
import {Glass} from './Glass';

export class Bar {
    constructor(orders, glasses, liquids, toppings, time, levelTarget, maxOrders=2) {
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
        // TODO: начинаем уровень
        this.status = 'Started';
        this._timeout = setTimeout(this.end, this.time, this);
    }

    tryPassOrder(order) {
        if (order.status === 'Not completed' || order.status === 'Fail') {
            return false;
        }
        if (order.status === 'Completed') {
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

export function generateOrder(maxLayers, topping, id) {
    let glass = glasses[Math.floor(Math.random()*glasses.length)];
    const layers = [];
    let sum = 0;
    let layersCount = Math.floor(Math.random()*maxLayers) + 1;
    for (let i=0; i<layersCount; i++) {
        const l = liquids[Math.floor(Math.random()*liquids.length)];
        layers.push(l);
        sum += l.price;
    }
    if (topping) {
        let t = toppings[Math.floor(Math.random() * toppings.length)];
        sum += t.price;
        return new Order(
            id,
            new Glass(glass, layers.length, layers, t),
            layers.length * 3000 + 2000, sum*2);
    }
    return new Order(
        id,
        new Glass(glass, layers.length, layers),
        layers.length * 3000, sum*2);
}

export function generateBar(ordersCount, maxLayers, levelTarget, ) {
    const orders = [];
    let time = 0;
    for (let i=0; i<ordersCount; i++) {
        const order = generateOrder(maxLayers, Math.random() > 0.5, i);
        orders.push(order);
        time += order.time;
    }

    return new Bar(orders, glasses, liquids, toppings, time, levelTarget, 4);
}


/*module.exports = { Bar };*/