const YELLOW = '#FFC700';

export function changeMoney(money, levelTarget, endAction) {
    const currentMoney = document.querySelector('.coin-value');
    currentMoney.textContent = `${money}`;

    if (money >= levelTarget) {
        document.querySelector('.first-star').style.color = YELLOW;
    }

    if (money >= levelTarget * 1.5) {
        document.querySelector('.second-star').style.color = YELLOW;
    }

    if (money >= levelTarget * 2) {
        document.querySelector('.third-star').style.color = YELLOW;
        endAction('Win');
    }
}

export function drawResultStars(money, levelTarget, level) {
    const progressStars = document.querySelector('.progress-stars');

    if (money >= levelTarget) {
        progressStars.querySelector('.first-star').style.color = YELLOW;
        if (+localStorage.getItem(level) < 1)
            localStorage.setItem(level, '1');
    }

    if (money >= levelTarget * 1.5) {
        progressStars.querySelector('.second-star').style.color = YELLOW;
        if (+localStorage.getItem(level) < 2)
            localStorage.setItem(level, '2');
    }

    if (money >= levelTarget * 2) {
        progressStars.querySelector('.third-star').style.color = YELLOW;
        localStorage.setItem(level, '3');
    }
}

export function runTimer(levelTarget, endAction) {
    const timer = document.querySelector('.time-left');
    const interval = setInterval(() => {
        const time = timer.textContent.split(':');
        let min = +time[0];
        let sec = +time[1];

        if (min === sec && min === 0) {
            if (+document.querySelector('.coin-value').textContent >= levelTarget) {
                endAction('Win');
            } else {
                endAction('Fail');
            }
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

    return interval;
}
