import {addLayersToGlassClone} from './index.js';


export function addDragAndDropEvent(obj, hidden, actionOnMouseUp, params = []) {
    obj.addEventListener('mousedown', (event) => {
        const objCopy = obj.cloneNode(true);
        if (hidden) {
            obj.style.visibility = 'hidden';
        }
        objCopy.style.opacity = '100';

        let X = obj.getBoundingClientRect().left;
        let Y = obj.getBoundingClientRect().top;

        let shiftX = event.clientX - X;
        let shiftY = event.clientY - Y;

        objCopy.style.position = 'absolute';
        objCopy.style.zIndex = '1000';
        document.body.append(objCopy);

        moveAt(event.pageX, event.pageY);

        // переносит объект на координаты (pageX, pageY),
        // дополнительно учитывая изначальный сдвиг относительно указателя мыши
        function moveAt(pageX, pageY) {
            objCopy.style.left = pageX - shiftX + 'px';
            objCopy.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        // передвигаем объект при событии mousemove
        document.addEventListener('mousemove', onMouseMove);

        objCopy.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMouseMove);
            actionOnMouseUp(obj, objCopy, ...params);
        });
    });
}

export function addDragAndDropEventForCocktailsInProgress(cocktail, places, actionOnMouseUp, params = []) {
    cocktail.addEventListener('mousedown', (event) => {

        if (places[cocktail.className].id === -1) {
            return;
        }

        let svg = cocktail.children[0].children[0];
        let rect = cocktail.getBoundingClientRect();

        // создание такого же бокала вместо прошлого
        let glassCopy = document.createElement(cocktail.children[0].tagName);
        document.getElementsByClassName(cocktail.className)[0].prepend(glassCopy);
        glassCopy.style.opacity = '0';
        addLayersToGlassClone(cocktail.className);

        svg.style.top = rect.top + 'px';
        svg.style.left = rect.left + 'px';
        svg.style.width = rect.width + 'px';
        svg.style.height = rect.height + 'px';

        if (cocktail.children[0].tagName.toLowerCase() === 'water-glass') { // привет, костыль))))
            svg.style.width = parseInt(svg.style.width) * 0.8 + 'px';
            svg.style.height = parseInt(svg.style.height) * 0.8 + 'px';
        }

        let X = svg.getBoundingClientRect().left;
        let Y = svg.getBoundingClientRect().top;

        let shiftX = event.clientX - X;
        let shiftY = event.clientY - Y;

        svg.style.position = 'absolute';
        svg.style.zIndex = '1000';
        document.body.append(svg);

        moveAt(event.pageX, event.pageY);

        function moveAt(pageX, pageY) {
            svg.style.left = pageX - shiftX + 'px';
            svg.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        svg.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMouseMove);
            actionOnMouseUp(svg, glassCopy, ...params);
        });
    });
}
