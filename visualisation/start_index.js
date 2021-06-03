const button = document.querySelector('.start-button');
button.addEventListener('click', ()=> window.location.replace('/game'));
document.cookie = `user=${100}`;
