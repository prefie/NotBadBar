// Проверка, что стакан находится в пределах картинки готового заказа (только по горизонтали)
export function checkGlassNearImage(glass, glassCopy) {
    let isNearImage = false;
    let place = null;
    const resultCocktails = document.querySelectorAll('.order')
    for (let cocktail of resultCocktails) {

        const classList = cocktail.classList;
        console.log(classList[classList.length - 1]);

        const glassWidth = glass.offsetWidth;
        const xLeft = cocktail.getBoundingClientRect().left - glassWidth / 2;
        const xRight = cocktail.getBoundingClientRect().right + glassWidth / 2;

        const gLeft = parseInt(glassCopy.style.left);
        const gRight = gLeft + glassWidth;

        if (xLeft < gLeft && xRight > gRight) {
            place = `${classList[classList.length - 1]}-glass`;
            isNearImage = true;
        }
    }

    return {isNearImage, place};
}