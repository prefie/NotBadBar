import express from 'express';
import path from 'path';
import hbs from 'express-handlebars';
import {Glass} from './logic/Glass.js';
import {Bar, generateBar} from './logic/Bar.js';
import {Liquid} from './logic/Ingredient.js';
import {Order} from './logic/Order.js';


const port = process.env.PORT ?? 3000;
const app = express();
const rootDir = process.cwd();

app.set('view engine', 'hbs');

app.use(express.static('logic'))

let order = null;
let bar = new Bar([new Order(
    1, new Glass('tall-glass', 2, [
        new Liquid('Campari', 4, 'red')]
    ),
    6000,
    10
    ), new Order(
    2, new Glass('tall-glass', 2, [
        new Liquid('Campari', 4, 'red')]
    ),
    6000,
    10
    )], ['1', '2', '3', '4'],
    ['Campari'],
    ['Cherry', 'Lime'],
    6000);

app.engine(
    'hbs',
    hbs({
        extname: 'hbs',
        defaultView: 'default',
        layoutsDir: path.join(rootDir, '/views/layouts/'),
    })
);

app.use('/visualisation', express.static('visualisation'));

app.get('/', (_, res) => {
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
