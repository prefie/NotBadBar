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
        if (order.status === "Not completed" || order.status === "Fail") {
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

/*module.exports = { Bar };*/