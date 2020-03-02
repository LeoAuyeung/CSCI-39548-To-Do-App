const express = require('express')
const Handlebars = require("handlebars"); // https://www.npmjs.com/package/handlebars
const exphbs = require('express-handlebars') // https://www.npmjs.com/package/express-handlebars
const fs = require('fs');
const axios = require('axios'); // https://www.npmjs.com/package/axios
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.urlencoded({ extended: false })); // necessary for HTML form submission to express
app.use(cookieParser());
const port = 3000;

// app.use(express.static('public')); // used to host 'public' folder as static HTML

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


var userListSource = "List of existing users:" +
    `<ul>
        {{#each .}}
            <li>{{id}}: {{username}}</li>
        {{/each}}
    </ul>`
var userListTemplate = Handlebars.compile(userListSource);

var todoListSource = "To-do list:" +
    `<ul>
        {{#each .}}
            {{#if deleted}}
            {{else}}
                {{#if completed}}
                    <li><del>{{content}}</del></li>
                {{else}}
                    <li>{{content}}</li>
                {{/if}}
                <form action="/updateToDo" method="post">
                    <input type="hidden" id="item_id" name="item_id" value={{id}}>
                    <input type="submit" value="Complete">
                </form>
                <form action="/deleteToDo" method="post">
                    <input type="hidden" id="item_id" name="item_id" value={{id}}>
                    <input type="submit" value="Delete">
                </form>
                <br/>
            {{/if}}
        {{/each}}
    </ul>`
var todoListTemplate = Handlebars.compile(todoListSource);

// ========== Page 1 - register, login ==========

// base render
app.get('/', function (req, res) {
    axios({
        method: 'get',
        url: 'https://hunter-todo-api.herokuapp.com/user',
    })
    .then(function (response) {
        const allUsers = response.data;
        const html = userListTemplate(allUsers);
        res.render('todo-app', {
            body: html
        });
    })
});

// addUser - register route
app.post('/addUser', function (req, res) {
    const username = req.body.name_register;
    axios({
        method: 'post',
        url: 'https://hunter-todo-api.herokuapp.com/user',
        data: {
            username: username,
        }
    })
    .then(function (response) {
        res.redirect("/");
    }).catch(function (error){
        console.log(error.response.data);
        res.send("Invalid signup (user may already exist). Try again.")
    })
});

// authUser - login route
app.post('/authUser', function (req, res) {
    const username = req.body.name_login;
    axios({
        method: 'post',
        url: 'https://hunter-todo-api.herokuapp.com/auth',
        data: {
            username: username,
        }
    })
    .then(function (response) {
        const token = response.data.token;
        res.cookie('token', token);
        res.redirect("/home");
    }).catch(function (error){
        console.log("error :", error.response.status);
        res.send("Invalid login. Try again.")
    })
});

// ========== Page 2 - logout, show to-do list, add item to list, delete item from list ==========

// home - post-login route
app.get('/home', function (req, res) {
    axios({
        method: 'get',
        url: 'https://hunter-todo-api.herokuapp.com/todo-item',
        headers: {
            Authorization: req.cookies.token,
        }
    })
    .then(function (response) {
        const allItems = response.data;
        console.log("allItems", allItems);
        const html = todoListTemplate(allItems);
        res.render('todo-list', {
            body: html
        });
    })
    .catch(function (error) {
        console.log("error :", error.response.status);
        res.render('todo-list');
    })
});

// logout - logout route
app.post('/logout', function (req, res) {
    res.clearCookie('token');
    res.redirect('/');
});

// addToDo - add to do item route
app.post('/addToDo', function (req, res) {
    const item = req.body.todo_item;
    axios({
        method: 'post',
        url: 'https://hunter-todo-api.herokuapp.com/todo-item',
        headers: {
            Authorization: req.cookies.token,
            'content-type': 'application/json',
        },
        data: {
            "content": item
        }
    })
    .then(function (response) {
        res.redirect("/home");
    })
    .catch(function (error) {
        console.log("error :", error.response.status);
        res.send("Invalid action. Try again.");
    })
});

// updateToDo - update item as completed
app.post('/updateToDo', function (req, res) {
    const id = req.body.item_id;
    axios({
        method: 'put',
        url: `https://hunter-todo-api.herokuapp.com/todo-item/${id}`,
        headers: {
            Authorization: req.cookies.token,
            'content-type': 'application/json',
        },
        data: {
            "completed": true
        }
    })
    .then(function (response) {
        res.redirect("/home");
    })
    .catch(function (error) {
        console.log("error :", error.response.status);
        res.send("Invalid action. Try again.");
    })
});

// deleteToDo - delete to do item route
app.post('/deleteToDo', function (req, res) {
    const id = req.body.item_id;
    axios({
        method: 'delete',
        url: `https://hunter-todo-api.herokuapp.com/todo-item/${id}`,
        headers: {
            Authorization: req.cookies.token,
        },
    })
    .then(function (response) {
        res.redirect("/home");
    })
    .catch(function (error) {
        console.log("error :", error.response.status);
        res.send("Invalid action. Try again.");
    })
});


app.listen((process.env.PORT || port), () => console.log(`App listening on port ${port}!`));

// ============================== Part 1e) Axios functions ==============================

// function getUsers() {
//     axios({
//         method: 'get',
//         url: 'https://hunter-todo-api.herokuapp.com/user',
//     })
//     .then(function (response) {
//         console.log(response.data);
//         return response.data;
//     })
// }

// function addUser(username) {
//     return axios({
//         method: 'post',
//         url: 'https://hunter-todo-api.herokuapp.com/user',
//         data: {
//             username: username,
//         }
//     })
//         .then(function (response) {
//             console.log(response.data);
//         })
// }

// function authUser(username) {
//     return axios({
//         method: 'post',
//         url: 'https://hunter-todo-api.herokuapp.com/auth',
//         data: {
//             username: username,
//         }
//     })
//         .then(function (response) {
//             console.log(response.data);
//         })
// }

// function getToDoList(username) {
//     // first login and get token
//     return axios({
//         method: 'post',
//         url: 'https://hunter-todo-api.herokuapp.com/auth',
//         data: {
//             username: username,
//         }
//     })
//     .then((response) => axios({
//         method: 'get',
//         url: 'https://hunter-todo-api.herokuapp.com/todo-item',
//         headers: {
//             Authorization: response.data.token,
//         }
//     }))
//     .then(function (response) {
//         console.log(response.data);
//     })
//     .catch(function (error) {
//         console.log(error.response);
//     })
// }

// function addToDo(username, item) {
//     // first login and get token
//     return axios({
//         method: 'post',
//         url: 'https://hunter-todo-api.herokuapp.com/auth',
//         data: {
//             username: username,
//         }
//     })
//         .then((response) => axios({
//             method: 'post',
//             url: 'https://hunter-todo-api.herokuapp.com/todo-item',
//             headers: {
//                 Authorization: response.data.token,
//                 'content-type': 'application/json',
//             },
//             data: {
//                 "content": item
//             }
//         }))
//         .then(function (response) {
//             console.log(response.data);
//         })
//         .catch(function (error) {
//             console.log(error.response);
//         })
// }

// function updateToDo(username, id) {
//     // first login and get token
//     return axios({
//         method: 'post',
//         url: 'https://hunter-todo-api.herokuapp.com/auth',
//         data: {
//             username: username,
//         }
//     })
//         .then((response) => axios({
//             method: 'put',
//             url: `https://hunter-todo-api.herokuapp.com/todo-item/${id}`,
//             headers: {
//                 Authorization: response.data.token,
//                 'content-type': 'application/json',
//             },
//             data: {
//                 "completed": true
//             }
//         }))
//         .then(function (response) {
//             console.log(response.data);
//         })
//         .catch(function (error) {
//             console.log(error.response);
//         })
// }

// function deleteToDo(username, id) {
//     // first login and get token
//     return axios({
//         method: 'post',
//         url: 'https://hunter-todo-api.herokuapp.com/auth',
//         data: {
//             username: username,
//         }
//     })
//         .then((response) => axios({
//             method: 'delete',
//             url: `https://hunter-todo-api.herokuapp.com/todo-item/${id}`,
//             headers: {
//                 Authorization: response.data.token,
//             },
//         }))
//         .then(function (response) {
//             console.log(response.data);
//         })
//         .catch(function (error) {
//             console.log(error.response);
//         })
// }

// ============================== Part 1e) Axios functions END ==============================

// (Main) calling axios functions

// getUsers()
// addUser('bobthebuilder');
// authUser('bobthebuilder')
// getToDoList('bobthebuilder')
// addToDo('bobthebuilder', 'building123')
// updateToDo('bobthebuilder', 189)
// deleteToDo('bobthebuilder', 190)