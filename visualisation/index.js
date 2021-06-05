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
                deletePatternGlass(choosePlace);
                if (data['status'] === 'Win' || data['status'] === 'Fail') {
                    end(data['status']);
                } else {
                    let place = pl[Math.floor(Math.random() * pl.length)];
                    places[place].id = data['id'];
                    places[place].pattern = data['pattern'];
                    drawPatternGlass(place);
                    places[place].progressBar = moveProgressBar(place, data.time);
                }
            });
        } else {
            changeColor(elem);
            height--;
            elem.style.height = height + '%';
        }
    }

    return id;
}

const pl = ['first-glass', 'second-glass', 'third-glass', 'fourth-glass'];
const places = {};
for (const gl of pl) {
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
    let place = pl[Math.floor(Math.random() * pl.length)];
    places[place].id = data['id'];
    places[place].progressBar = moveProgressBar(place, data['timeout']);
    places[place].pattern = data['pattern'];
    drawPatternGlass(place);
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
    if (places[place].id !== null) { // TODO: !!!!!!!!!!!
        requestGlass(classGlass, places[place].id).then((data) => {
            console.log(data); // JSON data parsed by `response.json()` call
        }).catch((data) => console.log(data));

        document.getElementsByClassName(place)[0].prepend(places[place].chooseGlass);
    }
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

function drawLayer(ingredientName, choosePlace, isLiquid=true) {  // TODO: change name
    if (isLiquid) {
        places[choosePlace].layers.push(colors[ingredientName] || ingredientName);
    } else {
        places[choosePlace].topping = ingredientName;
    }
    requestL(ingredientName, places[choosePlace].id, isLiquid).then((data) => {
        console.log(data);
        changeMoney(data['money']);
        if (data['status'] === 'next') {
            setTimeout(() => {
                clearInterval(places[choosePlace].progressBar);
                deleteGlass(choosePlace);
                deletePatternGlass(choosePlace);
            }, 1000);

            let place = pl[Math.floor(Math.random() * pl.length)];
            places[place].id = data['newId'];
            places[place].pattern = data['pattern'];

            setTimeout(function () {
                places[place].progressBar = moveProgressBar(place, data['timeout']);
                drawPatternGlass(place);
            }, 1000);
        } else if (data['status'] === 'delete') {
            setTimeout(deleteGlass, 1000, choosePlace);
        } else if (data['status'] === 'Win' || data['status'] === 'Fail') {
            clearInterval(places[choosePlace].progressBar);
            end(data['status']);
            // TODO: ЭТО КОНЕЦ!
        }
    });
}

let timer = document.querySelector('.time-left');
let interval = setInterval(() => {
    let time = timer.textContent.split(':');
    let min = +time[0];
    let sec = +time[1];

    if (min === sec && min === 0) {
        end('Fail');
    } else if (sec === 0) {
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
    let progress = document.querySelector('#' + place.split('-')[0] + '-progress-bar')
    progress.style.height = '100%';
    changeColor(progress);
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
    drawLayer(toppingsDict[chooseTopping], chooseGlass, false);
}

export function addLayersToGlassClone(placeName) {
    let oldLayers = places[placeName].layers.slice();
    places[placeName].layers = []
    for (const layer of oldLayers) {
        glassesAtBarHandler(placeName, layer);
    }
    if (places[placeName].topping) {
        toppingsHandler(placeName, places[placeName].topping);
    }
}

function end(status) {
    clearInterval(interval);
    if (status === 'Win') {
        let win = document.querySelector('.level-complete-modal');
        win.style.visibility = 'visible';
        document.querySelector('.overlay').style.visibility = 'visible';

        let m = +document.querySelector('.coin-value').textContent;

        let doc = document.querySelector('.progress-stars');
        if (m >= levelTarget) {
            doc.querySelector('.first-star').style.color = '#FFC700';
        }

        if (m >= levelTarget * 1.5) {
            doc.querySelector('.second-star').style.color = '#FFC700';
        }

        if (m >= levelTarget * 2) {
            doc.querySelector('.third-star').style.color = '#FFC700';
        }

        document.querySelector('.total-time').textContent = document.querySelector('.time-left').textContent;
        document.querySelector('.earned-money').textContent = `${m}`;

        let button = win.querySelector('.back-to-levels-button');
        button.addEventListener('click', ()=> window.location.replace('/levels'));
    } else {
        let fail = document.querySelector('.level-lose-modal');
        fail.style.visibility = 'visible';
        document.querySelector('.overlay').style.visibility = 'visible';

        let button = fail.querySelector('.back-to-levels-button');
        button.addEventListener('click', () => window.location.replace('/levels'));
        let button1 = fail.querySelector('.play-again-button');
        button1.addEventListener('click', () => window.location.replace('/game'));

    }
    console.log('!!!!' + status);
}

window.onunload = async function() {
    await fetch('/game/deleteBar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: {}
    });

    return false;
}

window.confirm = null;
