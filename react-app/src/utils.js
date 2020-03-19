const axios = require("axios");

export function getUsers() {
    axios({
        method: 'get',
        url: 'https://hunter-todo-api.herokuapp.com/user',
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    })
    .then(function (response) {
        console.log(response.data);
        const users = response.data;
        let usersArr = [];
        users.map(user => {
            usersArr.push(user.username)
        })
        console.log(usersArr)
        return usersArr;
    })
}

export function addUser(username) {
    return axios({
        method: 'post',
        url: 'https://hunter-todo-api.herokuapp.com/user',
        data: {
            username: username,
        }
    })
    .then(function (response) {
        console.log(response.data);
    })
}

export function authUser(username) {
    return axios({
        method: 'post',
        url: 'https://hunter-todo-api.herokuapp.com/auth',
        data: {
            username: username,
        }
    })
        .then(function (response) {
            console.log(response.data);
        })
}

export function getToDoList(username) {
    // first login and get token
    return axios({
        method: 'post',
        url: 'https://hunter-todo-api.herokuapp.com/auth',
        data: {
            username: username,
        }
    })
    .then((response) => axios({
        method: 'get',
        url: 'https://hunter-todo-api.herokuapp.com/todo-item',
        headers: {
            Authorization: response.data.token,
        }
    }))
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.log(error.response);
    })
}

export function addToDo(username, item) {
    // first login and get token
    return axios({
        method: 'post',
        url: 'https://hunter-todo-api.herokuapp.com/auth',
        data: {
            username: username,
        }
    })
        .then((response) => axios({
            method: 'post',
            url: 'https://hunter-todo-api.herokuapp.com/todo-item',
            headers: {
                Authorization: response.data.token,
                'content-type': 'application/json',
            },
            data: {
                "content": item
            }
        }))
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error.response);
        })
}

export function updateToDo(username, id) {
    // first login and get token
    return axios({
        method: 'post',
        url: 'https://hunter-todo-api.herokuapp.com/auth',
        data: {
            username: username,
        }
    })
        .then((response) => axios({
            method: 'put',
            url: `https://hunter-todo-api.herokuapp.com/todo-item/${id}`,
            headers: {
                Authorization: response.data.token,
                'content-type': 'application/json',
            },
            data: {
                "completed": true
            }
        }))
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error.response);
        })
}

export function deleteToDo(username, id) {
    // first login and get token
    return axios({
        method: 'post',
        url: 'https://hunter-todo-api.herokuapp.com/auth',
        data: {
            username: username,
        }
    })
        .then((response) => axios({
            method: 'delete',
            url: `https://hunter-todo-api.herokuapp.com/todo-item/${id}`,
            headers: {
                Authorization: response.data.token,
            },
        }))
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error.response);
        })
}