import express from 'express';
import path from 'path';
import hbs from "express-handlebars";
import {Glass} from './logic/Glass.js';
import {Bar} from "./logic/Bar.js";
import {Liquid, Topping} from "./logic/Ingredient.js";
import {Order} from "./logic/Order.js";


const port = process.env.PORT ?? 3000;
const app = express();
const rootDir = process.cwd();

app.set("view engine", "hbs");

app.use(express.static('logic'))

let order = null;
let bar = new Bar([new Order(
    1, new Glass("tall-glass", 2, [
        new Liquid("Campari", 4, "red")]
    ),
    6000,
    10
    ), new Order(
    2, new Glass("tall-glass", 2, [
        new Liquid("Campari", 4, "red")]
    ),
    6000,
    10
    )], ["1", "2", "3", "4"],
    ["Campari"],
    ["Cherry", "Lime"],
    6000);

app.engine(
    "hbs",
    hbs({
        extname: "hbs",
        defaultView: "default",
        layoutsDir: path.join(rootDir, "/views/layouts/"),
    })
);

app.use('/visualisation', express.static('visualisation'));

app.get("/", (_, res) => {
    res.redirect('/main');
});

app.get('/game', (req, res) => {
    res.render('game');
    bar = generateBar(10, 3, 100);
    bar.start();
    order = bar.orders.pop();
    bar.tryGetNextOrder(order);
    console.log(bar);
});

app.get('/main', (req, res) => {
    res.render('start');
});

app.post('/game/chooseGlass/:glassId', (req, res) => {
    order.chooseGlass(req.params['glassId']);
    res.send(JSON.stringify(order));
});

const prices = {
    'Absinthe': 5,
    'Aperol': 3,
    'Blue-Curasao': 4,
    'Bombay-Sapphire': 5,
    'Campari': 4
};

app.post('/game/getOrder/:ord', (req, res) => {
    if (bar.orders.length > 0) {
        order = bar.orders.pop();
        bar.tryGetNextOrder(order);
        res.send(JSON.stringify(order));
    } else {
        res.send(); // TODO: тут конец уровня
    }
})

app.post('/game/chooseLiquids/:liq/:ord', (req, res) => {
    order.addIngredientInGlass(new Liquid(req.params['liq'], prices[req.params['liq']]));
    const status = bar.tryPassOrder(order);

    const answer = {
        'money': bar.money,
        'status': 'wait',
        'timeout': 'none'
    }

    if (status && bar.orders.length > 0) {
        order = bar.orders.pop();
        answer['status'] = 'next';
        answer['timeout'] = order.time;
        res.send(JSON.stringify(answer));
        bar.tryGetNextOrder(order);
    } else if (status) {
        if (bar.ordersInProgress.length < 1) {
            answer['status'] = 'end'
            res.send(JSON.stringify(answer));
        } else {
            answer['status'] = 'delete';
            res.send(JSON.stringify(answer));
            order = null;
        }
    } else {
        res.send(JSON.stringify(answer));
    }

    console.log(bar.money);
});

app.listen(port, () => console.log(`App listening on port ${port}...`));
const glasses = ["water-glass", "short-glass", "tall-glass", "round-glass"];
const liquids = [new Liquid("Absinthe", 4),
    new Liquid("Aperol", 5),
    new Liquid('Blue-Curasao', 7),
    new Liquid('Bombay-Sapphire', 9),
    new Liquid("Campari", 7)];

const toppings = [new Topping("Lime", 10),
    new Topping("Cherry", 10),
    new Topping("Olive", 5),
    new Topping("Strawberry", 8)];

function generateOrder(maxLayers, topping, id) {
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

function generateBar(ordersCount, maxLayers, levelTarget, ) {
    const orders = [];
    let time = 0;
    for (let i=0; i<ordersCount; i++) {
        const order = generateOrder(maxLayers, Math.random() > 0.5, i);
        orders.push(order);
        time += order.time;
    }

    return new Bar(orders, glasses, liquids, toppings, time, levelTarget, 4);
}
