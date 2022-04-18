const URL = 'http://localhost:5000/api'

export const register = async (name, username, email, password) => {
    let data = {
        name,
        email: email.toLowerCase(),
        username,
        password,
    }

    let response = await fetch(URL + "/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    return response.json()
}

export const login = async (email, password) => {
    let data = {
        email: email.toLowerCase(),
        password,
    }

    let response = await fetch(URL + "/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })

    return response.json()
}

export const verify = async (token) => {
    let response = await fetch(URL + `/users/verify?token=${token}`)
    let res = await response.json();

    return res
}

export const logout = async (token) => {
    let response = await fetch(URL + `/users/logout?token=${token}`)
    let res = await response.json();

    return res
}

export const getProfile = async (userId) => {
    let response = await fetch(URL + `/users/profile?userId=${userId}`)
    return response.json()
}