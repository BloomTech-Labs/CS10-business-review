import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import LandingPage from './components//LandingPage';
import SignUp from './components//SignUp';
import SignIn from './components//SignIn';
import NavBar from  './components//NavBar';
import Search from './components/Search'
import './css/App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      search: ''
    }

  }
 SearchBusiness = () => {
 
 }
  render() {
    return (
      <div className="app-container">
        <Route path="/" component={LandingPage} exact />
        <Route path="/signup" component={SignUp} />
        <Route path="/search" component={Search} />   
        <Route path="/signin" component={SignIn} />
      </div>
    );
  }
}

export default App;
