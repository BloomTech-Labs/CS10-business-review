import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import SearchResults from './components/SearchResults';
import Business from './components/Business';
import User from './components/User';
import './css/App.css';
import axios from 'axios'

class App extends Component {
  state = {
    searchFired: false,
    searchTerm: '',
    searchResults: null,
    // Temporary until we have a DB
    businesses: [],
    business: null,
  };


  componentDidMount() {    
    axios.get('https://cryptic-brook-22003.herokuapp.com/api/business/')
    .then(business => {
      console.log("Business", business);
      this.setState({ businesses: business.data })
      console.log("State", this.state.businesses);
     })
     .catch(err => {
       console.log("Error:", err);
     })
   }
  // componentDidMount = () => {
  //   window.scrollTo(0, 0);
  //   this.resetSearch();
  // };

  componentDidUpdate = prevState => {
    if (prevState.searchResults === null) {
      this.resetSearch();
    }
  };

  render() {
    return (
      <div className="app-container">
        <Switch>
          <Route
            exact
            path="/"
            render={() => <LandingPage business={this.getBusiness} businesses={this.state.businesses} search={this.searchResults} />}
          />
          <Route
            path="/results"
            render={() => (
              <SearchResults
                business={this.getBusiness}
                search={this.searchResults}
                searchResults={this.state.searchResults}
              />
            )}
          />
          <Route path="/signup" render={() => <SignUp search={this.searchResults} />} />
          <Route path="/signin" render={() => <SignIn search={this.searchResults} />} />
          <Route
            path="/business/:_id"  render={() => <Business search={this.searchResults} business={this.state.businesses} />}
          />
          <Route path="/user" render={() => <User search={this.searchResults} />} />
        </Switch>
      </div>
    );
  }
  getBusiness = business => {
    this.setState({ business });
  };
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
