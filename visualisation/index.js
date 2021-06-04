import {changeColor} from './js/functions.js';
import {addDragAndDropEvent, addDragAndDropEventForCocktailsInProgress} from './js/dragAndDrop.js';
import {requestL, requestOrder, requestGlass, firstRequest} from './js/requests.js';
import {tryGetCocktailPlace,
    deleteExtraGlasses,
    checkObjNearGlass} from './js/glassFunctions.js';
import {colors, toppingsDict} from './js/config.js';

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
                places[choosePlace].pattern = data['pattern'];
                drawPatternGlass(choosePlace);
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
        'pattern': null,
        'chooseGlass': null,
        'layers': [],
        'topping': null,
        'progressBar': null
    };
}

let levelTarget = null;

firstRequest().then(data => {
    places['first-glass'].id = data['id'];
    places['first-glass'].progressBar = moveProgressBar('first-glass', data['timeout']);
    places['first-glass'].pattern = data['pattern'];
    drawPatternGlass('first-glass');
    levelTarget = data['target'];
});

let glasses = document.querySelectorAll('.glass');
for (let glass of glasses) {
    let classGlass = glass.classList[glass.classList.length - 1];
    addDragAndDropEvent(glass, false, tryPutGlass, [classGlass]);
}

function tryPutGlass(glass, glassCopy, classGlass) {
    if (glassCopy.parentNode) {
        glassCopy.parentNode.removeChild(glassCopy);
    }

    const {inPlace, place} = tryGetCocktailPlace(glass, glassCopy);
    if (!inPlace || places[place].layers.length !== 0) {
        return;
    }

    deleteGlass(place);

    places[place].chooseGlass = document.createElement(classGlass);
    requestGlass(classGlass, places[place].id).then((data) => {
        console.log(data); // JSON data parsed by `response.json()` call
    }).catch((data) => console.log(data));
    document.getElementsByClassName(place)[0].prepend(places[place].chooseGlass);
    //glassesAtBarHandler(place);
    updateCocktailsInProgress();
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

    const cocktailsInProgress = document.querySelector('.cocktails-in-progress');

    for (const cocktail of cocktailsInProgress.children) {
        if (cocktail.children.length < 1)
            continue;

        if (checkObjNearGlass(cocktail, bLeft, bRight, bTop, bBottom)) {
            let chooseBottle = bottle.classList[bottle.classList.length - 1];
            glassesAtBarHandler(cocktail.className.toLowerCase(), chooseBottle);
            return;
        }
    }
}

function glassesAtBarHandler(chooseGlass, chooseBottle) {
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
        firstLayer.setAttribute('class', colors[chooseBottle] || chooseBottle);
        drawLayer(chooseBottle, chooseGlass);
    } else if (places[chooseGlass].layers.length === 1) {
        // upper.setAttribute('class', colors[chooseBottle]); // TODO: сломались градиенты, надо чинить
        secondLayer.setAttribute('class', colors[chooseBottle] || chooseBottle);
        drawLayer(chooseBottle, chooseGlass);
    } else if (places[chooseGlass].layers.length === 2) {
        // lower.setAttribute('class', places[chooseGlass].layers[1]);
        thirdLayer.setAttribute('class', colors[chooseBottle] || chooseBottle);
        drawLayer(chooseBottle, chooseGlass);
    }
}

function drawLayer(bottleName, choosePlace) {  // TODO: change name
    places[choosePlace].layers.push(colors[bottleName] || bottleName);
    requestL(bottleName, places[choosePlace].id).then((data) => {
        console.log(data);
        changeMoney(data['money']);
        if (data['status'] === 'next') {
            setTimeout(deleteGlass, 1000, choosePlace);

            places[choosePlace].id = data['newId'];
            places[choosePlace].pattern = data['pattern'];
            setTimeout(function () {
                clearInterval(places[choosePlace].progressBar);
                places[choosePlace].progressBar = moveProgressBar(choosePlace, data['timeout']);
                drawPatternGlass(choosePlace);
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

    timer.textContent = `${min}:${(sec + '').padStart(2, '0')}`;
}, 1000);

function drawPatternGlass(place) {
    deletePatternGlass(place);
    let pattern = places[place].pattern;
    let glass = document.createElement(pattern.name);
    document.querySelector('.' + place.split('-')[0] + '-order').append(glass);
    glass.querySelector('#first-layer').setAttribute('class', pattern.liquids[0].color);
    if (pattern.liquids.length > 1)
        glass.querySelector('#second-layer').setAttribute('class', pattern.liquids[1].color);
    if (pattern.liquids.length > 2)
        glass.querySelector('#third-layer').setAttribute('class', pattern.liquids[2].color);
    //glass.querySelector('#upper').setAttribute('class', '*второй цвет*');
    //glass.querySelector('#lower').setAttribute('class', '*второй цвет*');

    if (pattern.topping !== null) {
        let topping = glass.querySelectorAll(`.${pattern.topping.name}`);

        for (let t of topping)
            t.setAttribute('class', 'visible-topping');
    }
    glass.style.visibility = 'visible';
}

function deletePatternGlass(place) {
    let gl = document.querySelector('.' + place.split('-')[0] + '-order');
    while (gl.firstChild) {
        gl.removeChild(gl.lastChild);
    }
}

function deleteGlass(place) {
    let glass = document.querySelector('.' + place);
    while (glass.firstChild) {
        glass.removeChild(glass.lastChild);
    }
    places[place].layers = [];
    places[place].topping = null;
}

const cocktailsInProgress = document.querySelector('.cocktails-in-progress').children;
function updateCocktailsInProgress() {
    for (let cocktail of cocktailsInProgress) {
        if (cocktail.children[0]) {
            addDragAndDropEventForCocktailsInProgress(cocktail, true, tryDeleteGlass, [cocktail.className]);
        }
    }
}

let trash = document.querySelector('.trash');
function tryDeleteGlass(glass, glassCopy, placeName) {

    const glassLeft = parseInt(glass.style.left);
    const glassTop = parseInt(glass.style.top);

    const a = glass.getBoundingClientRect();
    const glassWidth = a.width;
    const glassHeight = a.height;

    const glassRight = glassLeft + glassWidth;
    const glassBottom = glassTop + glassHeight;

    const trashRect = trash.getBoundingClientRect();
    const trashLeft = trashRect.left;
    const trashRight = trashRect.right;
    const trashTop = trashRect.top;
    const trashBottom = trashRect.bottom;

    deleteExtraGlasses();

    if (trashRight > glassRight + glassWidth
        || trashLeft < glassLeft - glassWidth
        || trashTop < glassTop - glassHeight
        || trashBottom > glassBottom + glassHeight) {
        glassCopy.style.opacity = '100';
        return;
    }

    deleteGlass(placeName);
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


const toppings = document.querySelectorAll('.decoration');
for (let topping of toppings) {
    addDragAndDropEvent(topping, false, tryPutTopping);
}

function tryPutTopping(topping, toppingCopy) {
    const bLeft = parseInt(toppingCopy.style.left);
    const bRight = bLeft + topping.offsetWidth;

    const bTop = parseInt(toppingCopy.style.top);
    const bBottom = bTop + topping.offsetHeight;

    if (toppingCopy.parentNode) {
        toppingCopy.parentNode.removeChild(toppingCopy);
    }

    const cocktailsInProgress = document.querySelector('.cocktails-in-progress');

    for (const cocktail of cocktailsInProgress.children) {
        if (cocktail.children.length < 1)
            continue;

        if (checkObjNearGlass(cocktail, bLeft, bRight, bTop, bBottom)) {
            let chooseTopping = topping.classList[topping.classList.length - 1];
            toppingsHandler(cocktail.className.toLowerCase(), chooseTopping);
            return;
        }
    }
}

function toppingsHandler(chooseGlass, chooseTopping) {
    if (places[chooseGlass].topping){
        return;
    }
    let glass = document.querySelector(`.${chooseGlass}`).children[0];
    let topping = glass.querySelectorAll(`.${toppingsDict[chooseTopping]}`);
    for (let t of topping){
        t.setAttribute('class', 'visible-topping');
    }
    places[chooseGlass].topping = chooseTopping;
    // TODO: requestTopping -- что-то на подобие requestL
}

export function addLayersToGlassClone(placeName) {
    let oldLayers = places[placeName].layers.slice();
    places[placeName].layers = []
    for (const layer of oldLayers) {
        glassesAtBarHandler(placeName, layer);
    }
    if (places[placeName].topping){
        toppingsHandler(placeName, places[placeName].topping);
    }
}