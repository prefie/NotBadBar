export async function requestGlass (id, orderId) {
    let response = await fetch('/game/chooseGlass/'+ id + '/' + orderId, {
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

export async function firstRequest () {
    let response = await fetch('/game/firstOrder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: {}
    });

    return await response.json();
}

export async function requestOrder () { // TODO: здесь надо бы визуализацию взятия нового заказа
    let response = await fetch('/game/getOrder/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: {}
    });

    return await response.json();
}

export async function requestL (liquidId, orderId) {
    let response = await fetch('/game/chooseLiquids/'+ liquidId + '/' + orderId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: {
            'id': liquidId,
            'orderId': orderId
        }
    });

    return await response.json();
}