const docs = ['.first-stars', '.second-stars', '.third-stars'];
for (let i of docs) {
    let doc = document.querySelector(i);
    let st = localStorage.getItem(i);
    if (st == '1')
    {
        doc.querySelector('.first-star').style.color = '#FFC700';
    }
    if (st == '2')
    {
        doc.querySelector('.first-star').style.color = '#FFC700';
        doc.querySelector('.second-star').style.color = '#FFC700';
    }
    if (st == '3')
    {
        doc.querySelector('.first-star').style.color = '#FFC700';
        doc.querySelector('.second-star').style.color = '#FFC700';
        doc.querySelector('.third-star').style.color = '#FFC700';
    }
}



const button = document.querySelector('.first-button');
button.addEventListener('click', () => window.location.replace('/game/1'))

const button1 = document.querySelector('.second-button');
button1.addEventListener('click', () => window.location.replace('/game/2'))

const button2 = document.querySelector('.third-button');
button2.addEventListener('click', () => window.location.replace('/game/3'))

const button3 = document.querySelector('.back-button');
button3.addEventListener('click', () => window.location.replace('/main'));