import {changeColor} from './js/functions';
import {addDragAndDropEvent} from './js/dragAndDrop';
import {requestL, requestOrder,requestGlass} from './js/requests';
import {checkGlassNearImage} from './js/glassFunctions';
import {colors} from './js/config';

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
                deleteGlass();
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
    addDragAndDropEvent(glass, false, tryPutGlass, [classGlass]);
}

function tryPutGlass(glass, glassCopy, classGlass) {
    if (glassCopy.parentNode) {
        glassCopy.parentNode.removeChild(glassCopy);
    }

    if (!checkGlassNearImage(glass, glassCopy) || layers.length !== 0) {
        return;
    }

    deleteGlass();
    chooseGlass = document.createElement(classGlass);
    requestGlass(classGlass).then((data) => {
        console.log(data); // JSON data parsed by `response.json()` call
    }).catch((data) => console.log(data));
    document.getElementsByClassName('table-wrapper')[0].prepend(chooseGlass);
    glassesAtBarHandler();
}

let bottles = document.querySelectorAll('.bottle');
for (let bottle of bottles) {
    addDragAndDropEvent(bottle, true, tryPourLiquid);
}

function tryPourLiquid(bottle, bottleCopy) {
    const bLeft = parseInt(bottleCopy.style.left);
    const bRight = bLeft + bottle.offsetWidth;

    const bTop = parseInt(bottleCopy.style.top);
    const bBottom = bTop + bottle.offsetHeight;

    if (bottleCopy.parentNode) {
        bottleCopy.parentNode.removeChild(bottleCopy);
    }

    bottle.style.visibility = 'visible';

    const gl = document.querySelector('#glass');
    if (!gl) {
        return;
    }
    const glRect = gl.getBoundingClientRect();
    const gLeft = glRect.left;
    const gRight = glRect.right;
    const gTop = glRect.top;
    const gBottom = glRect.bottom;
    const gWight = gRight - gLeft;
    const gHeight = gBottom - gTop;

    if (bRight > gRight + gWight
        || bLeft < gLeft - gWight
        || bTop < gTop - gHeight
        || bBottom > gBottom + gHeight) {
        return;
    }

    chooseBottle = bottle.classList[bottle.classList.length - 1];
    glassesAtBarHandler();
}

function glassesAtBarHandler () {
    const glassesAtBar = document.querySelectorAll('#glass');
    for (const glass of glassesAtBar) {
        if (chooseBottle === null || chooseGlass === null) {
            return;
        }

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