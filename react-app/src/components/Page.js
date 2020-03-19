import React, { Component } from "react";
import * as utils from '../utils.js';
const axios = require("axios");

class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameRegister: '',
            nameLogin: '',
            token: null,
        }
        // this.addUser = this.addUser.bind(this);
        // this.authUser = this.authUser.bind(this);
    }

    componentDidMount() {
        this.state.token == null ? (
            axios({
                method: 'get',
                url: 'https://hunter-todo-api.herokuapp.com/user',
            })
                .then(response => {
                    console.log(response.data);
                    const users = response.data;
                    let usersHTML = [];
                    users.map(user => {
                        usersHTML.push(<li>{user.id}: {user.username}</li>)
                    })
                    this.setState({
                        users: usersHTML
                    })
                })
        ) : (
                axios({
                    method: 'get',
                    url: 'https://hunter-todo-api.herokuapp.com/todo-item',
                    headers: {
                        Authorization: this.state.token,
                    }
                })
                    .then(response => {
                        const items = response.data;
                        console.log("items", items)
                        let itemsHTML = [];
                        items.map(item => {
                            if (item.completed) {
                                itemsHTML.push(<li><del>{item.content}</del></li>)
                            }
                            else {
                                itemsHTML.push(<li>{item.content}</li>)
                            }
                        })
                        this.setState({
                            items: itemsHTML
                        })
                    })
            )
    }

    addUser() {
        const username = this.state.nameRegister;
        axios({
            method: 'post',
            url: 'https://hunter-todo-api.herokuapp.com/user',
            data: {
                username: username,
            }
        })
            .then(response => {
                console.log("addUser: ", response.data);
            })
    }

    authUser() {
        const username = this.state.nameLogin;
        axios({
            method: 'post',
            url: 'https://hunter-todo-api.herokuapp.com/auth',
            data: {
                username: username,
            }
        })
            .then(response => {
                console.log("authUser: ", response.data);
                const token = response.data.token;
                this.setState({
                    token: token
                })
            })
    }

    getTodoItems = () => {
        const token = this.state.token;
        console.log(token)
        axios({
            method: 'get',
            url: 'https://hunter-todo-api.herokuapp.com/todo-item',
            headers: {
                Authorization: this.state.token,
            }
        })
        .then(response => {
            const items = response.data;
            console.log("items", items)
            let itemsHTML = [];
            items.map(item => {
                if (item.completed) {
                    itemsHTML.push(<li><del>{item.content}</del></li>)
                }
                else {
                    itemsHTML.push(<li>{item.content}</li>)
                }
            })
            this.setState({
                items: itemsHTML
            })
        })
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    };

    // plan: 
    // if no token, render signup/login
    // if token, render to-do list of token
    render() {
        const { token, nameLogin, nameRegister } = this.state;

        return (
            this.state.token == null ?
                (
                    <div align="center">
                        <form>
                        {/* <form onSubmit={this.addUser.bind(this)}> */}
                            <label>Register:</label><br />
                            <input type="text" name="nameRegister" placeholder="Enter a username here" value={nameRegister} onChange={this.handleChange.bind(this)} />
                            <input type="button" value="Register" onClick={this.addUser.bind(this)}/>
                            {/* <input type="submit" value="Register" /> */}
                        </form>

                        <br />
                        <p>or if you already have an account...</p>

                        <form>
                        {/* <form onSubmit={this.authUser.bind(this)}> */}
                            <label>Login:</label><br />
                            <input type="text" name="nameLogin" placeholder="Enter a username here" value={nameLogin} onChange={this.handleChange.bind(this)} />
                            <input type="button" value="Login" onClick={this.authUser.bind(this)} />
                            {/* <input type="submit" value="Login" /> */}
                        </form>
                        <p>(**You may have to click the Register/Login buttons manually instead of hitting enter/return)</p>
                        <br /><br />
                        <div>
                            List of current users:
                    <ul>
                                {this.state.users}
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div align="center">
                        WEEEEE
                        {() => this.getTodoItems.bind(this)}
                    </div>
                )
        )
    }
}

export default Page;