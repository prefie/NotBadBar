import {changeColor} from './js/functions.js';
import {addDragAndDropEvent} from './js/dragAndDrop.js';
import {requestL, requestOrder,requestGlass, firstRequest} from './js/requests.js';
import {checkGlassNearImage} from './js/glassFunctions.js';
import {colors} from './js/config.js';

function moveProgressBar(choosePlace, milliseconds) {
    let progress = choosePlace.split('-')[0] + '-progress-bar';
    let elem = document.querySelector('#' + progress);
    let height = 100;
    let id = setInterval(frame, milliseconds / 100); // тут время на приготовление коктейля
    function frame() {
        if (height <= 0) {
            clearInterval(id);
            requestOrder().then((data) => {
                console.log(data);
                clearInterval(id);
                deleteGlass(choosePlace);
                places[choosePlace].id = data['id'];
                places[choosePlace].progressBar = moveProgressBar(choosePlace, data.time);
            });
        } else {
            changeColor(elem);
            height--;
            elem.style.height = height + '%';
        }
    }
    return id;
}

const places = {};
for (const gl of ['first-glass', 'second-glass', 'third-glass', 'fourth-glass']) {
    places[gl] = {
        'id': null,
        'chooseGlass': null,
        'layers': [],
        'progressBar': null
    };
}

let levelTarget = null;

firstRequest().then(data => {
    places['first-glass'].id = data['id'];
    places['first-glass'].progressBar = moveProgressBar('first-glass', data['timeout']);
    levelTarget = data['target'];
});

let chooseBottle = null;

let glasses = document.querySelectorAll('.glass');
for (let glass of glasses) {
    let classGlass = glass.classList[glass.classList.length - 1];
    addDragAndDropEvent(glass, false, tryPutGlass, [classGlass]);
}

function tryPutGlass(glass, glassCopy, classGlass) {
    if (glassCopy.parentNode) {
        glassCopy.parentNode.removeChild(glassCopy);
    }

    const {isNearImage, place} = checkGlassNearImage(glass, glassCopy);

    if (!isNearImage || places[place].layers.length !== 0) {
        return;
    }

    deleteGlass(place);

    places[place].chooseGlass = document.createElement(classGlass);
    requestGlass(classGlass, places[place].id).then((data) => {
        console.log(data); // JSON data parsed by `response.json()` call
    }).catch((data) => console.log(data));
    document.getElementsByClassName(place)[0].prepend(places[place].chooseGlass);
    //glassesAtBarHandler(place);
    return place;
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

    const gl = document.querySelector('.cocktails-in-progress');

    for (const child of gl.children) {
        if (child.children.length < 1)
            continue;

        let b = child.children[0].children[0];

        function check (b) {
            const glRect = b.getBoundingClientRect();
            const gLeft = glRect.left;
            const gRight = glRect.right;
            const gTop = glRect.top;
            const gBottom = glRect.bottom;
            const gWight = gRight - gLeft;
            const gHeight = gBottom - gTop;

            return !(bRight > gRight + gWight
                || bLeft < gLeft - gWight
                || bTop < gTop - gHeight
                || bBottom > gBottom + gHeight);
        }

        if (check(b)) {
            chooseBottle = bottle.classList[bottle.classList.length - 1];
            glassesAtBarHandler(child.className.toLowerCase());
            return;
        }
    }
}

function glassesAtBarHandler (chooseGlass) {
    if (chooseBottle === null || chooseGlass === null) {
        return;
    }

    let doc = document.querySelector('.' + chooseGlass);
    let firstLayer = doc.querySelector('#first-layer');
    let secondLayer = doc.querySelector('#second-layer');
    let thirdLayer = doc.querySelector('#third-layer');
    let upper = doc.querySelector('#upper');
    let lower = doc.querySelector('#lower');

    if (places[chooseGlass].layers.length === 0) {
        firstLayer.style.fill = colors[chooseBottle];
        drawLayer(chooseBottle, chooseGlass);
    } else if (places[chooseGlass].layers.length === 1) {
        //upper.style.stopColor = colors[chooseBottle]; // TODO: сломались градиенты, надо чинить
        secondLayer.style.fill = colors[chooseBottle];
        drawLayer(chooseBottle, chooseGlass);
    } else if (places[chooseGlass].layers.length === 2) {
        //lower.style.stopColor = orders[chooseGlass].layers[1];
        thirdLayer.style.fill = colors[chooseBottle];
        drawLayer(chooseBottle, chooseGlass);
    }

    chooseBottle = null;
}

function drawLayer(bottleName, choosePlace) {  // TODO: change name
    places[choosePlace].layers.push(colors[bottleName]);
    requestL(bottleName, places[choosePlace].id).then((data) => {
        console.log(data);
        changeMoney(data['money']);
        if (data['status'] === 'next') {
            setTimeout(deleteGlass, 1000, choosePlace);

            places[choosePlace].id = data['newId'];
            setTimeout(function() {
                clearInterval(places[choosePlace].progressBar);
                places[choosePlace].progressBar = moveProgressBar(choosePlace, data['timeout']);
            }, 1000);
        } else if (data['status'] === 'delete') {
            setTimeout(deleteGlass, 1000, choosePlace);
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

    timer.textContent = `${min}:${(sec+'').padStart(2,'0')}`;
}, 1000);

let trash = document.querySelector(".trash");
trash.addEventListener('click', deleteGlass);

function deleteGlass(place) {
    let gl = document.querySelector('.' + place);
    if (gl !== null && gl.children.length !== 0)
        gl.removeChild(gl.children[0]);
    places[place].layers = [];
}

function changeMoney(m) {
    let money = document.querySelector(".coin-value");
    money.textContent = `${m}`;

    if (m >= levelTarget) {
        document.querySelector('.first-star').style.color = '#FFC700';
    }

    if (m >= levelTarget * 1.5) {
        document.querySelector('.second-star').style.color = '#FFC700';
    }

    if (m >= levelTarget * 2) {
        document.querySelector('.third-star').style.color = '#FFC700';
    }
}