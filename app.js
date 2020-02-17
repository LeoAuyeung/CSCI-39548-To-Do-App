const express = require('express')
const Handlebars = require("handlebars"); // https://www.npmjs.com/package/handlebars
const exphbs = require('express-handlebars') // https://www.npmjs.com/package/express-handlebars
const fs = require('fs');
const axios = require('axios'); // https://www.npmjs.com/package/axios

const app = express()
app.use(express.urlencoded({ extended: false })); // necessary for HTML form submission to express
const port = 3000

// app.use(express.static('public')); // used to host 'public' folder as static HTML

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

var source = "To-do list:" +
    `<ul>
        {{#each .}}
            {{#if completed}}
            <li><del>{{name}}</del></li>
            {{else}}
            <li>{{name}}</li>
            {{/if}}
        {{/each}}
    </ul>`
var template = Handlebars.compile(source);

app.get('/', async function (req, res) {
    fs.readFile('data.json', 'utf8', (err, data) => {
        // if (err) throw err;
        const html = template(JSON.parse(data));
        res.render('home', {
            body: html
        });
    })
});

app.post('/submit', function (req, res) {
    console.log(req.body.name);
    res.send('You sent the data "' + req.body.name + '".');
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

// ============================== Part 1e) Axios functions ==============================

function getUsers() {
    return axios({
        method: 'get',
        url: 'https://hunter-todo-api.herokuapp.com/user',
        // params: {
        //     username: 'bobthebuilder'
        // }
    })
        .then(function (response) {
            console.log(response.data);
        })
}

function addUser(username) {
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

function authUser(username) {
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

function getToDoList(username) {
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

function addToDo(username, item) {
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

function updateToDo(username, id) {
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

function deleteToDo(username, id) {
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

// ============================== Part 1e) Axios functions END ==============================

// (Main) calling axios functions

// getUsers()
// addUser('bobthebuilder');
// authUser('bobthebuilder')
getToDoList('bobthebuilder')
// addToDo('bobthebuilder', 'building123')
// updateToDo('bobthebuilder', 189)
// deleteToDo('bobthebuilder', 190)