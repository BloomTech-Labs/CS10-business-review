import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import axios from "axios";
import { withRouter } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import SearchResults from "./components/SearchResults";
import Business from "./components/Business";
import User from "./components/User";
import Redirect from "./components/Redirect";
import "./css/App.css";

let backend = process.env.REACT_APP_LOCAL_BACKEND;
let heroku = 'https://cryptic-brook-22003.herokuapp.com/';
if (typeof(backend) !== 'string') {
  backend = heroku;
}

class App extends Component {
  state = {
    searchFired: false,
    searchTerm: "",
    searchResults: null,
    featuredBusinesses: [],
    featuredReviews: [],
    featuredUsers: [],
    business: null,
  };

  componentWillMount = () => {
    this.handleLoad();
  };

  componentDidMount = () => {
    window.addEventListener("load", this.handleLoad);
  };

  handleLoad = () => {
    this.getDBBusinesses();
    this.getDBReviews();
    this.getDBUsers();
  };

  componentDidMount = () => {
    this.resetSearch();
    this.getDBBusinesses();
  };

  componentDidUpdate = prevState => {
    if (prevState.searchResults === null) {
      this.resetSearch();
    }
  };
  
  render() {
    return (
      <div className="app-container">
        <div id="animate-area">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <LandingPage
                business={this.getBusiness}
                businesses={this.state.featuredBusinesses}
                reviews={this.state.featuredReviews}
                users={this.state.featuredUsers}
                search={this.searchResults}
                getBusiness={this.getBusiness}
              />
            )}
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
          <Route path="/signin" render={() => <SignIn search={this.searchResults} authUser={this.authUser} />} />
          <Route
            path="/business"
            render={() => (
              <Business
                landingBusiness={this.state.landingBusiness}
                search={this.searchResults}
                business={this.state.business}
                createBusiness={this.createBusiness}
              />
            )}
          />
          {localStorage.getItem('token') &&  localStorage.getItem('userId') ? (
          <Route path="/user" render={() => <User search={this.searchResults} />} /> ):(
          <Route path="/user" render={() => <Redirect search={this.searchResults} />} />)}
        </Switch>
        </div>
      </div>
    );
  }

  getDBBusinesses = () => {
    axios
      .get(`${backend}api/business`)
      .then(businesses => {
        let featuredBusinesses = businesses.data.filter(business => {
          return business.stars >= 0;
        });
        this.setState({ featuredBusinesses });
      })
      .catch(err => {
        console.log("Error:", err);
      });
  };

  getDBReviews = () => {
    axios
      .get(`${backend}api/review/getAllReviews`)
      .then(reviews => {
        let featuredReviews = reviews.data.filter(review => {
          return review.numberOfLikes >= 0;
        });
        this.setState({ featuredReviews });
      })
      .catch(err => {
        console.log("Error:", err);
      });
  };

  getDBUsers = () => {
    axios
      .get(`${backend}api/user`)
      .then(users => {
        let featuredUsers = users.data.filter(user => {
          return user.numberOfLikes >= 0;
        });
        this.setState({ featuredUsers });
      })
      .catch(err => {
        console.log("Error:", err);
      });
  };

  getBusiness = (business, landingpage = false) => {
    if (landingpage) {
      Promise.resolve()
        .then(() => {
          let found = this.state.featuredBusinesses.filter(landingBusiness => {
            return landingBusiness._id === business._id;
          })[0];
          this.setState({
            business: found,
            landingBusiness: true,
          });
        })
        .then(() => {
          this.props.history.push("/business");
        })
        .catch(error => console.log({ error }));
    } else {
      axios
        .post(`${backend}api/business/placeSearch`, {
          id: business.place_id,
        })
        .then(response => {
          this.setState({ business: response.data, landingBusiness: false });
        })
        .then(() => {
          this.props.history.push(`/business`);
        })
        .catch(error => console.log("Error", error));
    }
  };

  searchResults = searchTerm => {
    axios
      .post(`${backend}api/business/placesSearch`, {
        query: searchTerm,
      })
      .then(response => {
        response.data.length ? this.setState({ searchResults: response.data }) : this.setState({ searchResults: null });
      })
      .then(() => {
        this.props.history.push(`/results`);
      })
      .catch(error => console.log("Error", error));
  };

  createBusiness = id => {
    axios
      .post(`${backend}api/business/create`, { id })
      .then(response => {
        this.setState({ business: response.data });
      })
      .catch(error => console.log("error", error));
  };

  resetSearch = () => {
    this.setState({ searchResults: null });
  };
}

export default withRouter(App);
