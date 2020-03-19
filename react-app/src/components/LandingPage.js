import React, { Component } from "react";
import { Route, Link, Redirect } from "react-router-dom";
const axios = require("axios");

class LandingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameRegister: '',
            nameLogin: '',
            errorMsg: '',
        }
        // this.authUser = this.authUser.bind(this);
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: 'api/user',
        })
        .then(response => {
            const users = response.data;
            let usersHTML = [];
            users.map(user => {
                usersHTML.push(<li>{user.id}: {user.username}</li>)
            })
            this.setState({
                users: usersHTML
            })
        })
    }

    addUser() {
        const username = this.state.nameRegister;
        axios({
            method: 'post',
            url: 'api/user',
            data: {
                username: username,
            }
        })
        .then(response => {
            console.log("addUser: ", response.data);
        })
        .catch(error => {
            console.log("Error: ", error.response.data);
            this.setState({
                errorMsg: "Error: " + error.response.data.error
            })
        })
    }

    authUser() {
        const username = this.state.nameLogin;
        axios({
            method: 'post',
            url: 'api/auth',
            data: {
                username: username,
            }
        })
        .then(response => {
            console.log("authUser: ", response.data);
            const token = response.data.token;
            this.props.cookies.set('token', token);
        })
        .catch(error => {
            console.log("Error: ", error.response.data.error);
            console.log(this.state)
            this.setState({
                errorMsg: "Error: " + error.response.data.error
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
        const { nameLogin, nameRegister, errorMsg } = this.state;

        return (
            this.props.cookies.cookies.token == null ? 
            (<div align="left" margin = "0 auto">
                <h1>Welcome to the To-Do-List App!</h1>
                <form>
                    {/* <form onSubmit={this.addUser.bind(this)}> */}
                    <label>Register:</label><br />
                    <input type="text" name="nameRegister" placeholder="Enter a username here" value={nameRegister} onChange={this.handleChange.bind(this)} />
                    <input type="button" value="Register" onClick={() => this.addUser()} />
                    {/* <input type="submit" value="Register" /> */}
                </form>

                <br />
                <p>or if you already have an account...</p>

                <form>
                    {/* <form onSubmit={this.authUser.bind(this)}> */}
                    <label>Login:</label><br />
                    <input type="text" name="nameLogin" placeholder="Enter a username here" value={nameLogin} onChange={this.handleChange.bind(this)} />
                    <input type="button" value="Login" onClick={() => this.authUser()} />
                    {/* <input type="submit" value="Login" to={'/home'}/> */}
                </form>
                <p><i>(**You may have to click the Register/Login buttons manually instead of hitting enter/return)</i></p>
                
                <p><b>{errorMsg}</b></p>
                <br /><br />
                <div>
                    List of current users:
                    <ul>
                        {this.state.users}
                    </ul>
                </div>
            </div>) : (<Redirect to="/home" />)
        )
    }
}

export default LandingPage;