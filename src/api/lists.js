const URL = 'http://localhost:5000/api'

export const create = async (name, userId, description) => {
    let data = {
        name,
        userId,
        description
    }

    const response = await fetch(URL + '/lists/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    return response.json()
}

export const update = async (name, description, listId) => {
    let data = {
        name,
        description,
        listId
    }

    const response = await fetch(URL + '/lists/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    return response.json()
}

export const deleteList = async (listId, userId) => {
    let data = {
        listId,
        userId
    }

    const response = await fetch(URL + '/lists/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    return response.json()
}


export const createCards = async (listId, arr) => {
    let data = {
        listId,
        arr
    }

    const response = await fetch(URL + '/lists/cards/createmany', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    return response.json()
}

export const getFeed = async () => {
    const response = await fetch(URL + '/lists/feed')
    return response.json()
}

export const getList = async (listId) => {
    const response = await fetch(URL + '/lists/findById?listId=' + listId)
    return response.json()
}

export const updateCards = async (listId, cards) => {
    let data = {
        listId,
        cards
    }

    const response = await fetch(URL + '/lists/cards/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    return response.json()
}