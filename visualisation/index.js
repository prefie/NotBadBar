function moveProgressBar() {
    let elem = document.getElementById("progress-bar");
    let height = 100;
    let id = setInterval(frame, 100); // тут время на приготовление коктейля
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
moveProgressBar();

let glasses = document.querySelectorAll('.glass');
for (let glass of glasses) {
    let classGlass = glass.classList[glass.classList.length - 1];
    glass.addEventListener('click', () => {
        if (layers.length !== 0)
            return;

        let gl = document.querySelector('#glass');
        if (gl !== null)
            gl.remove();

        chooseGlass = document.createElement(classGlass);
        document.getElementsByClassName('table-wrapper')[0].prepend(chooseGlass);
    });
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

            if (layers.length === 0) {
                firstLayer.style.fill = colors[bottle.classList[bottle.classList.length - 1]];
                layers.push(colors[bottle.classList[bottle.classList.length - 1]]);
            } else if (layers.length === 1) {
                upper.style.stopColor = colors[bottle.classList[bottle.classList.length - 1]];
                secondLayer.style.fill = colors[bottle.classList[bottle.classList.length - 1]];
                layers.push(colors[bottle.classList[bottle.classList.length - 1]]);
            } else if (layers.length === 2) {
                lower.style.stopColor = layers[1];
                thirdLayer.style.fill = colors[bottle.classList[bottle.classList.length - 1]];
                layers.push(colors[bottle.classList[bottle.classList.length - 1]]);
            }
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
}, 1000)
