import express from 'express';
import path from 'path';
import hbs from 'express-handlebars';
import {generateBar} from './logic/Bar.js';
import {Liquid} from './logic/Ingredient.js';
import {liquids} from "./logic/Bar.js";
import {Order} from "./logic/Order.js";
import {Glass} from "./logic/Glass.js";


const port = process.env.PORT ?? 3000;
const app = express();
const rootDir = process.cwd();

const users = {}

app.set('view engine', 'hbs');

app.use(express.static('logic'))

let bar = null;
let orders = {};

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

app.get('/levels', (_, res) => {
    res.render('levels');
});

app.get('/game', (req, res) => {
    bar = generateBar(10, 3, 14);
    //document.cookie = `user=${users.length}`;
    //users[req.cookies[0]] = bar;
    bar.start();
    const time = bar.time / 1000;
    const min = Math.floor(time / 60);
    const sec = (time % 60 + '').padStart(2, '0');
    res.render('game', {barTime: `${min}:${sec}`});
});

app.post('/game/firstOrder', (req, res) => {
    //bar.orders.push(new Order(228, new Glass('water-glass', 3, [new Liquid('Campari', 7)]), 10000, 21))
    //alert(document.cookie);
    //const bar = users[0];
    const order = bar.orders.pop();
    orders[order.id] = order;

    bar.tryGetNextOrder(orders[order.id]);
    console.log('___');
    console.log(order);
    console.log('___');
    res.send(JSON.stringify({
        'id': order.id,
        'timeout': order.time,
        'pattern': order.patternGlass,
        'target': bar.levelTarget
    }))
});

app.get('/main', (req, res) => {
    res.render('start');
});

app.post('/game/chooseGlass/:glassId/:ord', (req, res) => {
    console.log(orders);
    orders[req.params['ord']].chooseGlass(req.params['glassId']);
    res.send(JSON.stringify(orders[req.params['ord']]));
});

const prices = {};
for (let i of liquids) {
    prices[i.name] = i.price;
}

app.post('/game/getOrder', (req, res) => {
    if (bar.orders.length > 0) {
        let order = bar.orders.pop();
        orders[order.id] = order;

        bar.tryGetNextOrder(orders[order.id]);
        res.send(JSON.stringify({
            'id': order.id,
            'time': order.time,
            'pattern': order.patternGlass
        }));
    } else {
        res.send(); // TODO: тут конец уровня
    }
})

app.post('/game/chooseLiquids/:liq/:ord', (req, res) => {
    orders[req.params['ord']].addIngredientInGlass(new Liquid(req.params['liq'], prices[req.params['liq']]));
    console.log('____')
    console.log(orders[req.params['ord']].glass);
    console.log(orders[req.params['ord']].patternGlass);
    const status = bar.tryPassOrder(orders[req.params['ord']]);
    console.log(status)
    console.log('____')

    const answer = {
        'newId': null,
        'money': bar.money,
        'status': 'wait',
        'timeout': 'none',
        'pattern': null
    }

    if (status && bar.orders.length > 0) {
        let order = bar.orders.pop();
        orders[order.id] = order;

        answer['newId'] = order.id;
        answer['status'] = 'next';
        answer['timeout'] = order.time;
        answer['pattern'] = order.patternGlass
        res.send(JSON.stringify(answer));
        bar.tryGetNextOrder(orders[order.id]);
    } else if (status) {
        if (bar.ordersInProgress.length < 1) {
            answer['status'] = 'end'
            res.send(JSON.stringify(answer));
        } else {
            answer['status'] = 'delete';
            res.send(JSON.stringify(answer));
            delete orders[req.params['ord']];
        }
    } else {
        res.send(JSON.stringify(answer));
    }

    console.log(bar.money);
});

app.listen(port, () => console.log(`App listening on port ${port}...`));
