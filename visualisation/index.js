function moveProgressBar(milliseconds, orderId='1') {
    let elem = document.getElementById("progress-bar");
    let height = 100;
    let id = setInterval(frame, milliseconds / 100); // тут время на приготовление коктейля
    function frame() {
        if (height <= 0) {
            clearInterval(id);
            requestOrder(orderId).then((data) => {
                console.log(data);
                clearInterval(progressBar);
                progressBar = moveProgressBar(data.time);
            });
        } else {
            changeColor(elem);
            height--;
            elem.style.height = height + '%';
        }
    }
    return id;
}

function changeColor(e) {
    if (e.style.height) {
        let height = +(e.style.height).slice(0, -1);
        switch(true) {
            case (height <= 25):
                e.style.backgroundColor = "red";
                break;

            case (height > 25 && height <= 50):
                e.style.backgroundColor = "orange";
                break;

            case (height > 51 && height <= 75):
                e.style.backgroundColor = "yellow";
                break;

            case (height > 76 && height <= 100):
                e.style.backgroundColor = "green";
                break;
        }
    }
}


const orders = [];
const maxOrders = 4;
for (let i = 0; i < maxOrders; i++) {
    orders.push({
        'chooseGlass': null,
        'layers': []
    });
}


let chooseGlass = null;
let chooseBottle = null;
let layers = [];
let progressBar = moveProgressBar(6000);

let glasses = document.querySelectorAll('.glass');
for (let glass of glasses) {
    let classGlass = glass.classList[glass.classList.length - 1];
    glass.addEventListener('click', () => {
        if (layers.length !== 0)
            return;

        deleteGlass();
        chooseGlass = document.createElement(classGlass);
        requestGlass(classGlass).then((data) => {
            console.log(data); // JSON data parsed by `response.json()` call
        }).catch((data) => console.log(data));
        document.getElementsByClassName('table-wrapper')[0].prepend(chooseGlass);
        glassesAtBarHandler();
    });
}
async function requestGlass (id) {
    let response = await fetch('/game/chooseGlass/'+ id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: id
    });

    return await response.json();
}

async function requestOrder (orderId) { // TODO: здесь надо бы визуализацию взятия нового заказа
    return (await fetch('/game/getOrder/' + orderId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: {
            'orderId': orderId
        }
    })).json();
}

async function requestL (liquidId, orderId) {
    let response = await fetch('/game/chooseLiquids/'+ liquidId + '/' + orderId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: {
            'id': liquidId,
            'orderId': orderId
        }
    });

    return await response.json();
}

let colors = {
    'Absinthe': 'green',
    'Aperol': 'orange',
    'Blue-Curasao': 'blue',
    'Bombay-Sapphire': 'lightskyblue',
    'Campari': 'red'
};

let bottles = document.querySelectorAll('.bottle');
for (const bottle of bottles) {
    bottle.addEventListener('click', () => {
        chooseBottle = bottle.classList[bottle.classList.length - 1];
    });
}

function glassesAtBarHandler () {
    const glassesAtBar = document.querySelectorAll('#glass');
    for (const glass of glassesAtBar) {
        glass.addEventListener('click', function () {
            if (chooseGlass !== null && chooseBottle !== null) {
                let firstLayer = document.getElementById('first-layer');
                let secondLayer = document.getElementById('second-layer');
                let thirdLayer = document.getElementById('third-layer');
                let upper = document.getElementById('upper');
                let lower = document.getElementById('lower');

                if (layers.length === 0) {
                    firstLayer.style.fill = colors[chooseBottle];
                    drawLayer(chooseBottle);
                } else if (layers.length === 1) {
                    upper.style.stopColor = colors[chooseBottle];
                    secondLayer.style.fill = colors[chooseBottle];
                    drawLayer(chooseBottle);
                } else if (layers.length === 2) {
                    lower.style.stopColor = layers[1];
                    thirdLayer.style.fill = colors[chooseBottle];
                    drawLayer(chooseBottle);
                }

                chooseBottle = null;
            }
        })
    }
}


function drawLayer(name, orderId) {  // TODO: change name
    layers.push(colors[name]);
    requestL(name, orderId).then((data) => {
        console.log(data);
        changeMoney(data['money']);
        if (data['status'] === 'next') {
            setTimeout(deleteGlass, 1000);
            setTimeout(function() {
                clearInterval(progressBar);
                progressBar = moveProgressBar(data['timeout']);
            }, 1000);
        } else if (data['status'] === 'delete') {
            setTimeout(deleteGlass, 1000);
        }
    });
}

let timer = document.querySelector('.time-left');
let interval = setInterval(() => {
    let time = timer.textContent.split(':');
    let min = +time[0];
    let sec = +time[1];

    if (sec === 0) {
        if (min !== 0) {
            min--;
            sec = 59;
        } else {
            clearInterval(interval);
        }
    } else {
        sec--;
    }

    if (sec < 10) {
        sec = `0${sec}`;
    }

    timer.textContent = `${min}:${sec}`;
}, 1000);

let trash = document.querySelector(".trash");
trash.addEventListener('click', deleteGlass);

function deleteGlass() {
    let gl = document.querySelector('#glass');
    if (gl !== null)
        gl.remove();
    layers = [];
}

function changeMoney(m) {
    let money = document.querySelector(".coin-value");
    money.textContent = `${m}`;
}
