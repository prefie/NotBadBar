const stars = ['.first-stars', '.second-stars', '.third-stars'];
for (let star of stars) {
    const doc = document.querySelector(star);
    const data = localStorage.getItem(star);
    if (data === '1') {
        doc.querySelector('.first-star').style.color = '#FFC700';
    }
    if (data === '2') {
        doc.querySelector('.first-star').style.color = '#FFC700';
        doc.querySelector('.second-star').style.color = '#FFC700';
    }
    if (data === '3') {
        doc.querySelector('.first-star').style.color = '#FFC700';
        doc.querySelector('.second-star').style.color = '#FFC700';
        doc.querySelector('.third-star').style.color = '#FFC700';
    }
}


const firstButton = document.querySelector('.first-button');
firstButton.addEventListener('click', () => window.location.replace('/game/1'))

const secondButton = document.querySelector('.second-button');
secondButton.addEventListener('click', () => window.location.replace('/game/2'))

const thirdButton = document.querySelector('.third-button');
thirdButton.addEventListener('click', () => window.location.replace('/game/3'))

const backButton = document.querySelector('.back-button');
backButton.addEventListener('click', () => window.location.replace('/main'));