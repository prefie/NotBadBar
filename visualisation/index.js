function moveProgressBar(milliseconds) {
    let elem = document.getElementById("progress-bar");
    let height = 100;
    let id = setInterval(frame, milliseconds / 100); // тут время на приготовление коктейля
    function frame() {
        if (height <= 0) {
            clearInterval(id);
        } else {
            changeColor(elem);
            height--;
            elem.style.height = height + '%';
        }
    }
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


let chooseGlass = null;
let layers = [];
moveProgressBar(10000);

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

async function requestL (id) {
    let response = await fetch('/game/chooseLiquids/'+ id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: id
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
        if (chooseGlass !== null) {
            let firstLayer = document.getElementById('first-layer');
            let secondLayer = document.getElementById('second-layer');
            let thirdLayer = document.getElementById('third-layer');
            let upper = document.getElementById('upper');
            let lower = document.getElementById('lower');

            const name = bottle.classList[bottle.classList.length - 1];
            if (layers.length === 0) {
                firstLayer.style.fill = colors[name];
                drawLayer(name);
            } else if (layers.length === 1) {
                upper.style.stopColor = colors[name];
                secondLayer.style.fill = colors[name];
                drawLayer(name);
            } else if (layers.length === 2) {
                lower.style.stopColor = layers[1];
                thirdLayer.style.fill = colors[name];
                drawLayer(name);
            }
        }
    });
}

function drawLayer(name) {  // TODO: change name
    layers.push(colors[name]);
    requestL(name).then((data) => {
        console.log(data);
        changeMoney(data['money']);
        if (data['status'] === 'Completed') {
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
/*//ToDO money

let money = document.querySelector(".coin-value");
const p = document.createElement('p');
money.childNodes[0].remove();
p.innerHTML = bar.money;
money.append(p);

 */


