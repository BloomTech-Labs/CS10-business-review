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
import Reviewer from "./components/Reviewer";
import "./css/App.css";

let backend = process.env.REACT_APP_LOCAL_BACKEND;
let heroku = "https://cryptic-brook-22003.herokuapp.com/";
if (typeof backend !== "string") {
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
    reviewerId: null,
    reviews: null,
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
                  sendReviewer={this.sendReviewer}
                />
              )}
            />
            <Route
              path="/results"
              render={() => (
                <SearchResults
                  currentPage="0"
                  business={this.getBusiness}
                  search={this.searchResults}
                  searchResults={this.state.searchResults}
                />
              )}
            />
            <Route
              path="/reviewer"
              render={() => (
                <Reviewer search={this.searchResults} reviewer={this.state.reviewer} reviews={this.state.reviews} />
              )}
            />
            <Route path="/signup" render={() => <SignUp search={this.searchResults} />} />
            <Route path="/signin" render={() => <SignIn search={this.searchResults} authUser={this.authUser} />} />
            <Route
              exact
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
            {localStorage.getItem("token") && localStorage.getItem("userId") ? (
              <Route path="/user" render={() => <User search={this.searchResults} />} />
            ) : (
              <Route path="/user" render={() => <Redirect search={this.searchResults} />} />
            )}
          </Switch>
        </div>
      </div>
    );
  }

  // populate landing page
  getDBBusinesses = () => {
    axios
      .get(`${backend}api/business`)
      .then(businesses => {
        this.setState({ featuredBusinesses: businesses.data });
      })
      .catch(err => {
        console.log("Error:", err);
      });
  };

  // populate landing page
  getDBReviews = () => {
    axios
      .get(`${backend}api/review/getAllReviews`)
      .then(reviews => {
        this.setState({ featuredReviews: reviews.data });
      })
      .catch(err => {
        console.log("Error:", err);
      });
  };

  // populate landing page
  getDBUsers = () => {
    axios
      .get(`${backend}api/user`)
      .then(users => {
        this.setState({ featuredUsers: users.data });
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

  sendReviewer = reviewerId => {
    let user = new Promise(resolve => {
      return resolve(
        axios
          .get(`${backend}api/user/${reviewerId}`)
          .then(response => {
            
            this.setState({ reviewer: response.data });
          })
          .catch(err => {
            console.log("Error", err);
          }),
      );
    });
    let reviews = new Promise(resolve => {
      return resolve(
        axios
          .get(`${backend}api/review/getReviewsByReviewerId/${reviewerId}/${0}/${"No Filter"}/${"No Sorting"}`)
          .then(response => {
            this.setState({ reviews: response.data.reviews });
          })
          .catch(err => {
            console.log("Error", err);
          }),
      );
    });
    Promise.all([user, reviews])
      .then(() => {
        this.props.history.push(`/reviewer`);
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export default withRouter(App);
