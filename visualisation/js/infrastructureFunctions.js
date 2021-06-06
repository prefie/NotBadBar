export function changeColor(e) {
    if (e.style.height) {
        let height = +(e.style.height).slice(0, -1);
        switch (true) {
            case (height <= 25):
                e.style.backgroundColor = 'red';
                break;

            case (height > 25 && height <= 50):
                e.style.backgroundColor = 'orange';
                break;

            case (height > 51 && height <= 75):
                e.style.backgroundColor = 'yellow';
                break;

            case (height > 76 && height <= 100):
                e.style.backgroundColor = 'green';
                break;
        }
    }
}

export function getTime(milliseconds) {
    const time = milliseconds / 1000;
    const min = Math.floor(time / 60);
    const sec = (Math.floor(time % 60) + '').padStart(2, '0');
    return `${min}:${sec}`;
}

export function getMilliseconds(timer) {
    const time = timer.split(':');
    const min = +time[0];
    const sec = +time[1];
    return min * 60 * 1000 + sec * 1000;
}

export function addClass(topping, classStr) {
    return topping.split('\n').filter((elem) => elem).map((elem) => {
        const arr = elem.split(' ').filter(s => s);
        arr[0] = `${arr[0]} ${classStr}`;
        return arr.join(' ');
    }).join('');
}

