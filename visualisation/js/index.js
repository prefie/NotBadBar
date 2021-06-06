import {changeColor, getMilliseconds, getTime} from './infrastructureFunctions.js';
import {addDragAndDropEvent, addDragAndDropEventForCocktailsInProgress} from './dragAndDrop.js';
import {requestIngredient, requestOrder, requestGlass, requestFirstOrder, requestDeleteBar} from './requests.js';
import {tryGetCocktailPlace, deleteExtraGlasses, checkObjNearGlass} from './glassFunctions.js';
import {changeMoney, drawResultStars, runTimer} from './styleFunctions.js';
import {colors, toppingsDict} from './config.js';

const ordersTimeouts = [];
const placeNames = [];
const places = {};

const cocktailsInProgress = document.querySelector('.cocktails-in-progress').children;

for (const place of cocktailsInProgress) {
    const placeName = place.className;
    placeNames.push(placeName);
    places[placeName] = {
        'id': null,
        'pattern': null,
        'chooseGlass': null,
        'layers': [],
        'topping': null,
        'progressBar': null
    };
}

let levelTarget = null;
let level = null;
let timeBar = 0;
let countPlaces = 1;
let minTimePause = 0;
let maxTimePause = 0;
let timer = 0;

const glasses = document.querySelectorAll('.glass');
for (let glass of glasses) {
    let classGlass = glass.classList[glass.classList.length - 1];
    addDragAndDropEvent(glass, false, tryPutGlass, [classGlass]);
}

const bottles = document.querySelectorAll('.bottle');
for (const bottle of bottles) {
    addDragAndDropEvent(bottle, true, tryPourLiquid);
}

const toppings = document.querySelectorAll('.decoration');
for (let topping of toppings) {
    addDragAndDropEvent(topping, false, tryPutTopping);
}

requestFirstOrder().then(data => {
    const place = placeNames[Math.floor(Math.random() * placeNames.length)];
    places[place].id = data['id'];
    places[place].progressBar = moveProgressBar(place, data['timeout']);
    places[place].pattern = data['pattern'];

    drawPatternGlass(place);

    levelTarget = data['target'];
    timeBar = data['time'];
    countPlaces = data['countPlaces'];
    minTimePause = data['minTimePause'];
    maxTimePause = data['maxTimePause'];
    level = data['level'];

    for (let i = 0; i < countPlaces - 1; i++) {
        getNextOrder();
    }

    timer = runTimer(levelTarget, endGame);
});

function moveProgressBar(place, milliseconds) {
    const progressBarName = place.split('-')[0] + '-progress-bar';
    const progressBar = document.querySelector('#' + progressBarName);
    let height = 100;
    const id = setInterval(frame, milliseconds / 100); // тут время на приготовление коктейля
    function frame() {
        if (isGameEnd) {
            clearInterval(id);
            return id;
        }

        if (height <= 0) {
            clearInterval(id);
            deleteGlass(place);
            deletePatternGlass(place);
            places[place].id = null;

            getNextOrder();
        } else {
            changeColor(progressBar);
            height--;
            progressBar.style.height = height + '%';
        }
    }

    return id;
}

function getNextOrder() {
    const timeout = setTimeout(function () {
        if (isGameEnd) {
            clearTimeout(timeout);
            return;
        }

        requestOrder().then((data) => {
            if (data['status'] === 'Win' || data['status'] === 'Fail') {
                endGame(data['status']);
            } else if (data['next']) {
                const freePlace = placeNames.filter(x => places[x].id === null);
                const place = freePlace[Math.floor(Math.random() * freePlace.length)];

                places[place].id = data['id'];
                places[place].pattern = data['pattern'];
                drawPatternGlass(place);
                places[place].progressBar = moveProgressBar(place, data.time);
            }
        });
    }, Math.floor(Math.random() * (maxTimePause - minTimePause)) + minTimePause);

    ordersTimeouts.push(timeout);
}

function tryPutGlass(glass, glassCopy, classGlass) {
    if (glassCopy.parentNode) {
        glassCopy.parentNode.removeChild(glassCopy);
    }

    const {inPlace, place} = tryGetCocktailPlace(glass, glassCopy);
    if (!inPlace || places[place].layers.length !== 0 || places[place].topping) {
        return;
    }

    deleteGlass(place);

    places[place].chooseGlass = document.createElement(classGlass);
    if (places[place].id !== null) {
        requestGlass(classGlass, places[place].id).catch(data => console.log(data));

        document.getElementsByClassName(place)[0].prepend(places[place].chooseGlass);
    }

    updateCocktailsInProgress();
    return place;
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
            addIngredient(chooseBottle, cocktail.className.toLowerCase(), true);
            return;
        }
    }
}

function glassesAtBarHandler(placeName, bottle) {
    if (bottle === null || placeName === null) {
        return;
    }

    const place = document.querySelector('.' + placeName);
    const firstLayer = place.querySelector('#first-layer');
    const secondLayer = place.querySelector('#second-layer');
    const thirdLayer = place.querySelector('#third-layer');

    if (places[placeName].layers.length === 0) {
        firstLayer.setAttribute('class', colors[bottle] || bottle);
    } else if (places[placeName].layers.length === 1) {
        secondLayer.setAttribute('class', colors[bottle] || bottle);
    } else if (places[placeName].layers.length === 2) {
        thirdLayer.setAttribute('class', colors[bottle] || bottle);
    }

    places[placeName].layers.push(colors[bottle] || bottle);
}

function addIngredient(ingredient, place, isLiquid = true) {
    if (isLiquid) {
        glassesAtBarHandler(place, ingredient);
    } else {
        toppingsHandler(place, ingredient);
    }

    requestIngredient(ingredient, places[place].id, isLiquid).then((data) => {
        changeMoney(data['money'], levelTarget, endGame);
        if (data['status'] === 'next') {
            clearInterval(places[place].progressBar);
            setTimeout(() => {
                deleteGlass(place);
                deletePatternGlass(place);
                places[place].id = null;
                places[place].pattern = null;
            }, 1000);

            getNextOrder();
        } else if (data['status'] === 'delete') {
            setTimeout(deleteGlass, 1000, place);
        } else if (data['status'] === 'Win' || data['status'] === 'Fail') {
            clearInterval(places[place].progressBar);
            endGame(data['status']);
        }
    });
}

if (localStorage.getItem('.first-stars') === null) {
    localStorage.setItem('.first-stars', '0');
    localStorage.setItem('.second-stars', '0');
    localStorage.setItem('.third-stars', '0');
}

function drawPatternGlass(place) {
    deletePatternGlass(place);

    const pattern = places[place].pattern;
    const glass = document.createElement(pattern.name);
    document.querySelector('.' + place.split('-')[0] + '-order').append(glass);
    glass.querySelector('#first-layer').setAttribute('class', pattern.liquids[0].color);

    if (pattern.liquids.length > 1) {
        glass.querySelector('#second-layer').setAttribute('class', pattern.liquids[1].color);
    }
    if (pattern.liquids.length > 2) {
        glass.querySelector('#third-layer').setAttribute('class', pattern.liquids[2].color);
    }

    if (pattern.topping) {
        const toppings = glass.querySelectorAll(`.${pattern.topping.name}`);

        for (let topping of toppings) {
            topping.setAttribute('class', 'visible-topping');
        }
    }
    glass.style.visibility = 'visible';
}

function deletePatternGlass(place) {
    const progress = document.querySelector('#' + place.split('-')[0] + '-progress-bar');
    progress.style.height = '100%';
    changeColor(progress);

    const glass = document.querySelector('.' + place.split('-')[0] + '-order');
    while (glass.firstChild) {
        glass.removeChild(glass.lastChild);
    }
}

function deleteGlass(place) {
    const glass = document.querySelector('.' + place);
    while (glass.firstChild) {
        glass.removeChild(glass.lastChild);
    }

    places[place].layers = [];
    places[place].topping = null;
}

function updateCocktailsInProgress() {
    for (const cocktail of cocktailsInProgress) {
        if (cocktail.children[0]) {
            addDragAndDropEventForCocktailsInProgress(cocktail, true, tryDeleteGlass, [cocktail.className]);
        }
    }
}

const trash = document.querySelector('.trash');

function tryDeleteGlass(glass, glassCopy, place) {
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

    deleteGlass(place);
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
            addIngredient(toppingsDict[chooseTopping], cocktail.className.toLowerCase(), false);
            return;
        }
    }
}

function toppingsHandler(place, topping) {
    if (places[place].topping) {
        return;
    }

    const glass = document.querySelector(`.${place}`).children[0];
    const toppings = glass.querySelectorAll(`.${topping}`);
    for (let topping of toppings) {
        topping.setAttribute('class', 'visible-topping');
    }

    places[place].topping = topping;
}

export function addLayersToGlassClone(place) {
    const oldLayers = places[place].layers.slice();
    places[place].layers = [];

    for (const layer of oldLayers) {
        glassesAtBarHandler(place, layer);
    }

    if (places[place].topping) {
        toppingsHandler(place, places[place].topping);
    }
}

let isGameEnd = false;

function endGame(status) {
    if (isGameEnd) {
        return;
    }

    isGameEnd = true;
    clearInterval(timer);

    for (const place in places) {
        if (places[place].progressBar !== null) {
            clearInterval(places[place].progressBar);
        }
    }

    for (const timeout of ordersTimeouts) {
        clearTimeout(timeout);
    }

    if (status === 'Win') {
        const win = document.querySelector('.level-complete-modal');
        win.style.visibility = 'visible';
        document.querySelector('.overlay').style.visibility = 'visible';

        const money = +document.querySelector('.coin-value').textContent;
        drawResultStars(money, levelTarget, level);

        document.querySelector('.total-time').textContent =
            getTime(timeBar - getMilliseconds(document.querySelector('.time-left').textContent));
        document.querySelector('.earned-money').textContent = `${money}`;

        const backToLevelsButton = win.querySelector('.back-to-levels-button');
        backToLevelsButton.addEventListener('click', () => window.location.replace('/levels'));
    } else if (status === 'Fail') {
        loseHandler(document.querySelector('.level-lose-modal'));
    } else {
        loseHandler(document.querySelector('.distract-modal'));
    }

    function loseHandler(element) {
        element.style.visibility = 'visible';
        document.querySelector('.overlay').style.visibility = 'visible';

        const backToLevelsButton = element.querySelector('.back-to-levels-button');
        backToLevelsButton.addEventListener('click', () => window.location.replace('/levels'));

        const playAgainButton = element.querySelector('.play-again-button');
        playAgainButton.addEventListener('click', () => window.location.reload());
    }
}

window.addEventListener('beforeunload', requestDeleteBar);

window.addEventListener('blur', function () {
    endGame('Distracted');
})

window.confirm = null;
