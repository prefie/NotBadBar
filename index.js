import express from 'express';
import path from 'path';
import hbs from 'express-handlebars';
import cookieParser from 'cookie-parser'
import {generateBar} from './logic/Bar.js';
import {Liquid, Topping} from './logic/Ingredient.js';
import {liquids, toppings} from "./logic/Bar.js";
import {getTime} from './visualisation/js/infrastructureFunctions.js';


const port = process.env.PORT ?? 3000;
const app = express();
const rootDir = process.cwd();

const users = {};

const prices = {};
for (let i of liquids) {
    prices[i.name] = i.price;
}

for (let i of toppings) {
    prices[i.name] = i.price;
}

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

app.post('/game/deleteBar', (req, res) => {
    deleteBar(req.cookies['token']);
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
        'minTimePause': 1000,
        'maxTimePause': 1000,
        'level': '.first-stars'
    },
    '2': {
        'count': 30,
        'layers': 3,
        'target': 300,
        'time': 120000,
        'countPlaces': 2,
        'timeForLayer': 6000,
        'minTimePause': 2000,
        'maxTimePause': 8000,
        'level': '.second-stars'
    },
    '3': {
        'count': 50,
        'layers': 3,
        'target': 500,
        'time': 180000,
        'countPlaces': 4,
        'timeForLayer': 10000,
        'minTimePause': 4000,
        'maxTimePause': 12000,
        'level': '.third-stars'
    }
};

app.get('/game/:level', (req, res) => {
    let cookie;
    if ('token' in req.cookies) {
        cookie = req.cookies['token'];
    } else {
        cookie = makeCookie(32);
        res.cookie('token', cookie);
    }

    const user = {};
    user.level = levels[req.params['level']];
    user.bar = generateBar(
        user.level['count'],
        user.level['layers'],
        user.level['target'],
        user.level['time'],
        user.level['countPlaces'],
        user.level['timeForLayer']
    );

    user.orders = {};
    users[cookie] = user;

    user.bar.start();
    res.render('game', {barTime: getTime(user.bar.time)});
});

app.post('/game/firstOrder', (req, res) => {
    const user = users[req.cookies['token']];
    const order = user.bar.orders.pop();
    user.orders[order.id] = order;

    user.bar.tryGetNextOrder(user.orders[order.id]);
    res.send(JSON.stringify({
        'id': order.id,
        'timeout': order.time,
        'pattern': order.patternGlass,
        'target': user.bar.levelTarget,
        'time': user.bar.time,
        'countPlaces': user.bar.maxOrders,
        'minTimePause': user.level['minTimePause'],
        'maxTimePause': user.level['maxTimePause'],
        'level': user.level['level']
    }))
});

app.get('/main', (req, res) => {
    res.render('start');
});

app.get('/levels', (req, res) => {
    res.render('levels');
});

app.get('/rules', (req, res) => {
    res.render('rules');
});

app.post('/game/chooseGlass/:glassId/:ord', (req, res) => {
    const user = users[req.cookies['token']];

    user.orders[req.params['ord']].chooseGlass(req.params['glassId']);
    res.send(JSON.stringify(user.orders[req.params['ord']]));
});

app.post('/game/getOrder', (req, res) => {
    const user = users[req.cookies['token']];

    if (user.bar.orders.length > 0) {
        const order = user.bar.orders.pop();
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
    }
})

app.post('/game/chooseLiquids/:liq/:ord/:isLiquid', (req, res) => {
    const user = users[req.cookies['token']];
    if (req.params['isLiquid'] === 'true') {
        user.orders[req.params['ord']].addIngredientInGlass(new Liquid(req.params['liq'], prices[req.params['liq']]));
    } else {
        user.orders[req.params['ord']].addIngredientInGlass(new Topping(req.params['liq'], prices[req.params['liq']]));
    }

    const status = user.bar.tryPassOrder(user.orders[req.params['ord']]);

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
});

function makeCookie(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

app.listen(port, () => console.log(`App listening on port ${port}...`));
