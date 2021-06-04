// Проверка, что стакан находится в пределах какого-то из четырех мест и получение нужного места
export function tryGetCocktailPlace(glass, glassCopy) {
    let inPlace = false;
    let resultPlace = null;
    const places = document.querySelector('.cocktails-in-progress').children;
    for (let place of places) {

        let glassWidth = glass.clientWidth;
        let glassHeight = glass.clientHeight;

        if (glass.className === 'glass water-glass') {
            glassWidth *= 3/2;
            glassHeight *= 3/2;
        }

        const placeRect = place.getBoundingClientRect();
        const placeLeft = placeRect.left;
        const placeRight = placeRect.right;
        const placeTop = placeRect.top;
        const placeBottom = placeRect.bottom;

        const glassLeft = parseInt(glassCopy.style.left);
        const glassRight = glassLeft + glassWidth;
        const glassTop = parseInt(glassCopy.style.top);
        const glassBottom = glassTop + glassHeight;

        if (placeRight > glassRight + glassWidth
            || placeLeft < glassLeft - glassWidth
            || placeTop < glassTop - glassHeight
            || placeBottom > glassBottom + 2 * glassHeight) {
            continue;
        }

        resultPlace = place.className;
        inPlace = true;
    }

    return {inPlace, place: resultPlace};
}

// удаление из html стаканов, которые создаются при перетаскивании
export function deleteExtraGlasses() {
    const glasses = document.querySelectorAll('#glass');
    for (let gl of glasses) {
        if (gl.parentNode.nodeName.toLowerCase() === 'body') {
            gl.parentNode.removeChild(gl);
        }
    }
}
