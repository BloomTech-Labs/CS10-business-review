import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import SearchResults from './components/SearchResults';
import './css/App.css';

class App extends Component {
  state = {
    searchFired: false,
    searchTerm: '',
    searchResults: null,
    // Temporary until we have a DB
    businesses: [
      { name: 'Taco Bell', location: 'East' },
      { name: 'Taco Bell', location: 'West' },
      { name: 'Taco Bell', location: 'North' },
      { name: 'Taco Bell', location: 'South' },
      { name: 'Taco Bell', location: 'Out of the way' },
    ],
  };

  componentDidMount = () => {
    this.resetSearch();
  };

  componentDidUpdate = prevState => {
    if (prevState.searchResults === null) {
      console.log(this.state.searchResults);
      this.resetSearch();
    }
  };

  render() {
    return (
      <div className="app-container">
        <Switch>
          <Route exact path="/" render={() => <LandingPage search={this.searchResults} />} />
          <Route
            path="/results"
            render={() => <SearchResults search={this.searchResults} searchResults={this.state.searchResults} />}
          />
          <Route path="/signup" render={() => <SignUp search={this.searchResults} />} />
          <Route path="/signin" render={() => <SignIn search={this.searchResults} />} />
        </Switch>
      </div>
    );
  }
  searchResults = searchTerm => {
    let searchResults = this.state.businesses.filter(business => {
      return business.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    searchResults.length ? this.setState({ searchResults }) : this.setState({ searchResults: null });
  };
  resetSearch = () => {
    this.setState({ searchResults: null });
  };
}

export default App;