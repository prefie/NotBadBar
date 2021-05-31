export async function requestGlass (id) {
    let response = await fetch('/game/chooseGlass/'+ id, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: id
    });

    return await response.json();
}

export async function requestOrder (orderId) { // TODO: здесь надо бы визуализацию взятия нового заказа
    let response = await fetch('/game/getOrder/' + orderId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: {
            'orderId': orderId
        }
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