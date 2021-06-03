// Проверка, что стакан находится в пределах какого-то из четырех мест и получение нужного места
export function tryGetCocktailPlace(glass, glassCopy) {
    let inPlace = false;
    let place = null;
    const cocktailInProgress = document.querySelector('.cocktails-in-progress').children;
    for (let cocktail of cocktailInProgress) {

        const glassWidth = glass.offsetWidth;
        const glassHeight = glass.offsetHeight;
        const cocktailRect = cocktail.getBoundingClientRect();
        const cocktailLeft = cocktailRect.left;
        const cocktailRight = cocktailRect.right;
        const cocktailTop = cocktailRect.top;
        const cocktailBottom = cocktailRect.bottom;

        const glassLeft = parseInt(glassCopy.style.left);
        const glassRight = glassLeft + glassWidth;
        const glassTop = parseInt(glassCopy.style.top);
        const glassBottom = glassTop + glassHeight;

        if (cocktailRight > glassRight + glassWidth
            || cocktailLeft < glassLeft - glassWidth
            || cocktailTop < glassTop - glassHeight
            || cocktailBottom > glassBottom + glassHeight) {
            continue;
        }

        place = cocktail.className;
        inPlace = true;
    }

    return {inPlace, place};
}