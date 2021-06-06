// Проверка, что стакан находится в пределах какого-то из четырех мест и получение нужного места
export function tryGetCocktailPlace(glass, glassCopy) {
    let inPlace = false;
    let resultPlace = null;
    const places = document.querySelector('.cocktails-in-progress').children;
    for (let place of places) {

        let glassWidth = glass.clientWidth;
        let glassHeight = glass.clientHeight;

        if (glass.className === 'glass water-glass') {
            glassWidth *= 3 / 2;
            glassHeight *= 3 / 2;
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
            || placeTop < glassTop - 2 * glassHeight
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
    for (let glass of glasses) {
        if (glass.parentNode.nodeName.toLowerCase() === 'body') {
            glass.parentNode.removeChild(glass);
        }
    }
}

// проверка, что бутылка или топпинг находится около бокала
export function checkObjNearGlass(glass, objLeft, objRight, objTop, objBottom) {
    const _glass = glass.children[0].children[0];
    const glRect = _glass.getBoundingClientRect();
    const gLeft = glRect.left;
    const gRight = glRect.right;
    const gTop = glRect.top;
    const gBottom = glRect.bottom;
    const gWidth = gRight - gLeft;
    const gHeight = gBottom - gTop;

    return !(objRight > gRight + gWidth
        || objLeft < gLeft - gWidth
        || objTop < gTop - 2 * gHeight
        || objBottom > gBottom + 2 * gHeight);
}