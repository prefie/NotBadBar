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
    })
}
