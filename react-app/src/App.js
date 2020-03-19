import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { CookiesProvider, withCookies } from 'react-cookie';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import Page from './components/Page';
import LandingPage from './components/LandingPage';
import TodoPage from './components/TodoPage';

class App extends Component {
  render() {
    return (
      <CookiesProvider>
        <Router>
          <Switch>
            <Route
              exact path="/"
              render={(props) => <LandingPage cookies={this.props.cookies} />}
            />
            <Route
              exact path="/home"
              render={(props) => <TodoPage cookies={this.props.cookies} />}
            />
          </Switch>
        </Router>
      </CookiesProvider>
    );
  }
}

export default withCookies(App);
