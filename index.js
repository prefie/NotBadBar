import express from 'express';
import path from 'path';
import hbs from "express-handlebars";


const port = process.env.PORT ?? 3000;
const app = express();
const rootDir = process.cwd();

app.set("view engine", "hbs");

app.use(express.static('logic'))
import {Glass} from './logic/Glass.js';
import {Bar} from "./logic/Bar.js";
import {Liquid} from "./logic/Ingredient.js";
import {Order} from "./logic/Order.js";

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
    )], ["1", "2", "3"],
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
    bar = new Bar([new Order(
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
        )], ["1", "2", "3"],
        ["Campari"],
        ["Cherry", "Lime"],
        6000);
    bar.start();
    order = bar.orders.pop();
    bar.tryGetNextOrder(order);
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
app.post('/game/chooseLiquids/:liq', (req, res) => {
    order.addIngredientInGlass(new Liquid(req.params['liq'], prices[req.params['liq']]));
    const status = bar.tryPassOrder(order);
    res.send(JSON.stringify({'money': bar.money, 'status': order.status}));
    if (status && bar.orders.length > 0) {
        order = bar.orders.pop();
        bar.tryGetNextOrder(order);
    } else {
        order = null;
    }
    console.log(bar.money);
});

app.listen(port, () => console.log(`App listening on port ${port}...`));
