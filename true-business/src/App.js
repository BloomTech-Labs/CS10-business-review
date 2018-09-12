import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import SearchResults from './components/SearchResults';
import './css/App.css';

class App extends Component {
  render() {
    return (
      <div className="app-container">
        <Route path="/" component={LandingPage} exact />
        <Route path="/signup" component={SignUp} />
        <Route path="/signin" component={SignIn} />
        <Route path='/results' component={SearchResults} />
      </div>
    );
  }
}

export default App;
