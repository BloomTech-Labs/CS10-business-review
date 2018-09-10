import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import LandingPage from './components/LandingPage/LandingPage'
import SignUp from './components/SignUp/SignUp'
import SignIn from './components/SignIn/SignIn'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/" component={LandingPage} exact />
        <Route path="/signup" component={SignUp} />
        <Route path="/signin" component={SignIn} />
      </div>
    );
  }
}

export default App;
