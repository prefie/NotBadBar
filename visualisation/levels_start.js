const button = document.querySelector('.start-level-button');
button.addEventListener('click', ()=> window.location.replace('/game'));
document.cookie = `user=${100}`;
