import React, { Component } from "react";
import { Route, Link, Redirect } from "react-router-dom";
const axios = require("axios");

class TodoPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newItem: '',
        }
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: 'api/todo-item',
            headers: {
                Authorization: this.props.cookies.cookies.token,
            }
        })
        .then(response => {
            const items = response.data;
            let itemsHTML = [];
            items.map(item => {
                if (item.deleted) {

                }
                else {
                    if (item.completed) {
                        itemsHTML.push(<li><del>{item.content}</del></li>)
                    }
                    else {
                        itemsHTML.push(<li>{item.content}</li>)
                    }
                    itemsHTML.push(
                        <div>
                            <form>
                                <input type="button" value="Complete" onClick={() => this.updateToDo(item.id)} />
                            </form>
                            <form>
                                <input type="button" value="Delete" onClick={() => this.deleteToDo(item.id)} />
                            </form>
                        </div>
                    )
                }
            })
            this.setState({
                items: itemsHTML
            })
        })
    }

    addToDo() {
        const item = this.state.newItem;
        axios({
            method: 'post',
            url: 'api/todo-item',
            headers: {
                Authorization: this.props.cookies.cookies.token,
                'content-type': 'application/json',
            },
            data: {
                "content": item
            }
        })
        .then(response => {
            console.log("adding new todo items...");
            window.location.reload();
        })
    }

    updateToDo(id) {
        axios({
            method: 'put',
            url: `api/todo-item/${id}`,
            headers: {
                Authorization: this.props.cookies.cookies.token,
                'content-type': 'application/json',
            },
            data: {
                "completed": true
            }
        })
        .then(response => {
            console.log("UPDATE todo items...");
            window.location.reload();
        })
    }

    deleteToDo(id) {
        axios({
            method: 'delete',
            url: `api/todo-item/${id}`,
            headers: {
                Authorization: this.props.cookies.cookies.token,
            },
        })
            .then(response => {
                console.log("DELETE todo items...");
                window.location = "/home";
            })
    }

    logout() {
        this.props.cookies.remove('token');
        console.log(this.props.cookies);
        window.location = "/";
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value
        });
    };

    render() {
        const { newItem } = this.state;

        return (
            <div align="left">
                <br/>
                <input type="button" value="Logout" onClick={this.logout.bind(this)} />
                {/* <form> */}
                <br/><br/>
                <label>Insert item to add to the list:</label><br />
                <input type="text" name="newItem" placeholder="Enter a new item" value={newItem} onChange={this.handleChange.bind(this)} />
                <input type="button" value="Add Item" onClick={this.addToDo.bind(this)} />
                <br/><br/>
                <h1>To-do list:</h1>
                {/* </form> */}
                {this.state.items}
                <br />
            </div>
        )
    }
}

export default TodoPage;