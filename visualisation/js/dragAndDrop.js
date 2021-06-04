export function addDragAndDropEvent(obj, hidden, actionOnMouseUp, params=[]){
    obj.addEventListener('mousedown', (event) => {
        const objCopy = obj.cloneNode(true);
        if (hidden) {
            obj.style.visibility = 'hidden';
        }

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

export function addDragAndDropEventForCocktailsInProgress(cocktail, hidden, actionOnMouseUp, params=[]){
    cocktail.addEventListener('mousedown', (event) => {

        let obj = cocktail.children[0].children[0];
        let rect = cocktail.getBoundingClientRect();

        //const objCopy = cocktail.children[0].children[0].cloneNode(true);

        //создание такого же бокала вместо прошлого
        let objCopy = document.createElement(cocktail.children[0].tagName);
        document.getElementsByClassName(cocktail.className)[0].prepend(objCopy);
        objCopy.style.visibility = 'hidden';
        //TODO: уметь раскрасить этот бокал также, как тот, что стоял до него

        obj.style.top = rect.top + 'px';
        obj.style.left = rect.left + 'px';
        obj.style.width = rect.width + 'px';
        obj.style.height = rect.height + 'px';

        let X = obj.getBoundingClientRect().left;
        let Y = obj.getBoundingClientRect().top;

        let shiftX = event.clientX - X;
        let shiftY = event.clientY - Y;

        obj.style.position = 'absolute';
        obj.style.zIndex = '1000';
        document.body.append(obj); //change

        moveAt(event.pageX, event.pageY);

        // переносит объект на координаты (pageX, pageY),
        // дополнительно учитывая изначальный сдвиг относительно указателя мыши
        function moveAt(pageX, pageY) {
            obj.style.left = pageX - shiftX + 'px';
            obj.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        // передвигаем объект при событии mousemove
        document.addEventListener('mousemove', onMouseMove);

        obj.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', onMouseMove);
            actionOnMouseUp(obj, objCopy, ...params);
        });
    });
}
