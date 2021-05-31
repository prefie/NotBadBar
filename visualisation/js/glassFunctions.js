import {requestGlass} from "./requests";

// Проверка, что стакан находится в пределах картинки готового заказа (только по горизонтали)
export function checkGlassNearImage(glass, glassCopy) {
    let isNearImage = false;
    const cocktailImages = document.querySelectorAll('.cocktail-image')
    for (let cocktail of cocktailImages) {
        const glassWidth = glass.offsetWidth;
        const xLeft = cocktail.getBoundingClientRect().left - glassWidth / 2;
        const xRight = cocktail.getBoundingClientRect().right + glassWidth / 2;

        const gLeft = parseInt(glassCopy.style.left);
        const gRight = gLeft + glassWidth;

        if (xLeft < gLeft && xRight > gRight) {
            isNearImage = true;
        }
    }

    return isNearImage
}