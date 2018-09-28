import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import axios from "axios";
import { withRouter } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import SearchResults from "./components/SearchResults";
import Business from "./components/Business";
import Subscriber from "./components/Subscriber";
import "./css/App.css";

class App extends Component {
  state = {
    searchFired: false,
    searchTerm: "",
    searchResults: null,
    featuredBusinesses: [],
    business: null,
    newBusinessId: null,
  };

  componentWillMount = () => {
    this.getDBBusinesses();
  };

  componentDidMount = () => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
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
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <LandingPage
                business={this.getBusiness}
                businesses={this.state.featuredBusinesses}
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
          <Route path="/signin" render={() => <SignIn search={this.searchResults} authSubscriber={this.authSubscriber} />} />
          <Route
            path="/business"
            render={() => (
              <Business
                landingBusiness={this.state.landingBusiness}
                search={this.searchResults}
                business={this.state.business}
                createBusiness={this.createBusiness}
                newBusinessId={this.state.newBusinessId}
              />
            )}
          />
          <Route path="/subscriber" render={() => <Subscriber search={this.searchResults} />} />
        </Switch>
      </div>
    );
  }
  getDBBusinesses = () => {
    axios
      .get("http://localhost:3001/api/business")
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
        .post(
          "http://localhost:3001/api/business/placeSearch",
          { id: business.place_id },
        )
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
      .post(
        "http://localhost:3001/api/business/placesSearch",
        {
          query: searchTerm,
        },
      )
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
      .post(
        "http://localhost:3001/api/business/create",
        { id },
      )
      .then(response => {
        this.setState({ newBusinessId: response.data });
      })
      .catch(error => console.log("error", error));
  };

  resetSearch = () => {
    this.setState({ searchResults: null });
  };
}

export default withRouter(App);
