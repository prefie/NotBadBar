export async function requestGlass(id, orderId) {
    const response = await fetch('/game/chooseGlass/' + id + '/' + orderId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: {
            'id': id,
            'orderId': orderId
        }
    });

    return await response.json();
}

export async function requestFirstOrder() {
    const response = await fetch('/game/firstOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });

    return await response.json();
}

export async function requestOrder() {
    const response = await fetch('/game/getOrder/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });

    return await response.json();
}

export async function requestIngredient(ingredient, orderId, isLiquid) {
    const response = await fetch('/game/chooseLiquids/' + ingredient + '/' + orderId + '/' + isLiquid, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: {
            'id': ingredient,
            'orderId': orderId
        }
    });

    return await response.json();
}

export async function requestDeleteBar() {
    await fetch('/game/deleteBar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        }
    });
}
