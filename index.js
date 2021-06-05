import express from 'express';
import path from 'path';
import hbs from 'express-handlebars';
import cookieParser from 'cookie-parser'
import {generateBar} from './logic/Bar.js';
import {Liquid, Topping} from './logic/Ingredient.js';
import {liquids, toppings} from "./logic/Bar.js";
import {Order} from "./logic/Order.js";
import {Glass} from "./logic/Glass.js";


const port = process.env.PORT ?? 3000;
const app = express();
const rootDir = process.cwd();

const users = {};

app.set('view engine', 'hbs');

app.use(express.static('logic'));
app.use(cookieParser());

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

app.post('/game/deleteBar', (req, res) => {
    console.log('###');
    console.log(users);
    deleteBar(req.cookies['token']);
    console.log(users);
    res.send();
});

function deleteBar(cookie) {
    delete users[cookie];
}

const levels = {
    '1': {
        'count': 25,
        'layers': 2,
        'target': 250,
        'time': 100000,
        'countPlaces': 1,
        'timeForLayer': 6000,
        'minTimePause': 0,
        'maxTimePause': 0
    },
    '2': {
        'count': 30,
        'layers': 3,
        'target': 300,
        'time': 120000,
        'countPlaces': 2,
        'timeForLayer': 6000,
        'minTimePause': 2000,
        'maxTimePause': 8000
    },
    '3': {
        'count': 50,
        'layers': 3,
        'target': 500,
        'time': 180000,
        'countPlaces': 4,
        'timeForLayer': 10000,
        'minTimePause': 4000,
        'maxTimePause': 12000
    }
};

app.get('/game/:level', (req, res) => {
    console.log(req.cookies);
    let cookie = '';
    if (!('token' in req.cookies)) {
        cookie = makeId(32);
        res.cookie('token', cookie);
    } else {
        cookie = req.cookies['token'];
    }

    const user = {};
    const level = levels[req.params['level']];
    user.bar = generateBar(level['count'], level['layers'], level['target'], level['time'], level['countPlaces'], level['timeForLayer']);
    user.orders = {};

    users[cookie] = user;
    console.log(users);

    user.bar.start();
    const time = user.bar.time / 1000;
    const min = Math.floor(time / 60);
    const sec = (Math.floor(time % 60) + '').padStart(2, '0');
    res.render('game', {barTime: `${min}:${sec}`});
});

function makeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

app.post('/game/firstOrder', (req, res) => {
    const user = users[req.cookies['token']];

    const order = user.bar.orders.pop();
    user.orders[order.id] = order;

    user.bar.tryGetNextOrder(user.orders[order.id]);
    console.log('___');
    console.log(order);
    console.log('___');
    res.send(JSON.stringify({
        'id': order.id,
        'timeout': order.time,
        'pattern': order.patternGlass,
        'target': user.bar.levelTarget,
        'time': user.bar.time,
        'countPlaces': user.bar.maxOrders
    }))
});

app.get('/main', (req, res) => {
    res.render('start');
});

app.get('/levels', (req, res) => {
    res.render('levels');
});

app.post('/game/chooseGlass/:glassId/:ord', (req, res) => {
    const user = users[req.cookies['token']];

    console.log(user.orders);
    user.orders[req.params['ord']].chooseGlass(req.params['glassId']);
    res.send(JSON.stringify(user.orders[req.params['ord']]));
});

const prices = {};
for (let i of liquids) {
    prices[i.name] = i.price;
}

for (let i of toppings) {
    prices[i.name] = i.price;
}

app.post('/game/getOrder', (req, res) => {
    const user = users[req.cookies['token']];

    if (user.bar.orders.length > 0) {
        let order = user.bar.orders.pop();
        user.orders[order.id] = order;

        user.bar.tryGetNextOrder(user.orders[order.id]);
        res.send(JSON.stringify({
            'id': order.id,
            'time': order.time,
            'pattern': order.patternGlass,
            'status': user.bar.status,
            'next': true
        }));
    } else {
        user.bar.filter();
        res.send(JSON.stringify({
            'status': user.bar.status,
            'next': false
        }));

        console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ')
        console.log(user.bar.orders.length);
        console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ')
    }
})

app.post('/game/chooseLiquids/:liq/:ord/:isLiquid', (req, res) => {
    const user = users[req.cookies['token']];
    console.log('!!!!!!!!!!!' + req.params['isLiquid']);
    if (req.params['isLiquid'] === 'true') {
        user.orders[req.params['ord']].addIngredientInGlass(new Liquid(req.params['liq'], prices[req.params['liq']]));
    } else {
        console.log('TOPPING!!!!!!!')
        user.orders[req.params['ord']].addIngredientInGlass(new Topping(req.params['liq'], prices[req.params['liq']]));
    }

    console.log('____');
    console.log(user.orders[req.params['ord']].glass);
    console.log(user.orders[req.params['ord']].patternGlass);
    const status = user.bar.tryPassOrder(user.orders[req.params['ord']]);
    console.log(status);
    console.log('____');

    const answer = {
        'money': user.bar.money,
        'status': 'wait'
    };

    if (status && user.bar.orders.length > 0) {
        answer['status'] = 'next';
        res.send(JSON.stringify(answer));
    } else if (status) {
        if (user.bar.ordersInProgress.length < 1) {
            answer['status'] = user.bar.status
            res.send(JSON.stringify(answer));
        } else {
            answer['status'] = 'delete';
            res.send(JSON.stringify(answer));
            delete user.orders[req.params['ord']];
        }
    } else {
        res.send(JSON.stringify(answer));
    }

    console.log(user.bar.money);
});

app.listen(port, () => console.log(`App listening on port ${port}...`));
