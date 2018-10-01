import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NavBar from "./NavBar.js";
import axios from "axios";

import "../css/User.css";

let backend = process.env.REACT_APP_LOCAL_BACKEND;
let heroku = "https://cryptic-brook-22003.herokuapp.com/";
if (typeof backend !== "string") {
  backend = heroku;
}

class User extends Component {
  state = {
    username: "",
    email: "",
    editUsernameOrEmail: false,
    Email: false,
    editPassword: false,
    currenAction: "Change",
    change: false,
    breadcrumbs: ["Home"],
    userReviews: [
      {
        business: "Taco Bell",
        businessType: '"Tacos" *cough*',
        businessstreet: "123 West",
        businessCity: "Knoxville, TN 37919",
        updated: "1/1/1",
      },
      {
        business: "Taco Bell",
        businessType: '"Tacos" *cough*',
        businessstreet: "123 West",
        businessCity: "Knoxville, TN 37919",
        updated: "1/1/1",
      },
      {
        business: "Taco Bell",
        businessType: '"Tacos" *cough*',
        businessstreet: "123 West",
        businessCity: "Knoxville, TN 37919",
        updated: "1/1/1",
      },
      {
        business: "Taco Bell",
        businessType: '"Tacos" *cough*',
        businessstreet: "123 West",
        businessCity: "Knoxville, TN 37919",
        updated: "1/1/1",
      },
    ],
    current: "Home",
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  componentDidMount = () => {
    setTimeout(() => {
      const id = localStorage.getItem("userId");
      axios.get(`${backend}api/user/${id}`).then(response => {
        this.setState({
          username: response.data.username,
          email: response.data.email,
        });
      });
    }, 300);
  };

  saveUsernameOrEmail = () => {
    const user = {
      username: this.state.username,
      email: this.state.email,
    };

    console.log("Before", user);
    const id = localStorage.getItem("userId");
    axios
      .put(`${backend}api/user/${id}`, user)
      .then(response => {
        console.log("SaveResponse", response);
        this.setState({
          editUsernameOrEmail: false,
        });
      })
      .catch(err => {
        console.log("Update Error", err);
      });
  };

  logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    this.props.history.push("/");
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  changeCurrentAction = () => {
    if (this.state.change) {
      this.setState({
        currenAction: "Change",
      });
    } else {
      this.setState({
        currenAction: "Cancel",
      });
    }
  };

  changeUsernameOrEmail = () => {
    this.changeCurrentAction();
    this.setState({
      openForChange: !this.state.openForChange,
      change: !this.state.change,
    });
  };

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        <div className="user">
          <div className="user__header">
            <div className="header__breadcrumbs">
              {this.state.breadcrumbs.map((crumb, i) => {
                if (i + 1 === this.state.breadcrumbs.length) {
                  return (
                    <button key={i} name={crumb} onClick={this.updateCurrent} className="breadcrumbs__breadcrumb">
                      {crumb}
                    </button>
                  );
                }
                return (
                  <div>
                    <button key={i} name={crumb} onClick={this.updateCurrent} className="breadcrumbs__breadcrumb">
                      {crumb}
                    </button>
                    <i className="fas fa-arrow-right" />
                  </div>
                );
              })}
            </div>
            <div className="header__signout" onClick={this.logout}>
              Sign Out
            </div>
          </div>
          <div className="user__body">
            <div className="body__left-bar">
              <button className="left-bar__button" name="Add a Review" onClick={this.updateCurrent}>
                Add a Review
              </button>
              <button className="left-bar__button" name="My Reviews" onClick={this.updateCurrent}>
                My Reviews
              </button>
              <button className="left-bar__button" name="Billing" onClick={this.updateCurrent}>
                Billing
              </button>
              <button className="left-bar__button" name="Settings" onClick={this.updateCurrent}>
                Settings
              </button>
            </div>
            <div className="body__content">{this.loadContent()}</div>
          </div>
        </div>
      </div>
    );
  }
  updateCurrent = event => {
    let breadcrumbs = this.state.breadcrumbs;
    // Home => Home
    if (event.target.name === "Home") {
      // Home->Whatever => Home
      if (breadcrumbs.length === 2) {
        breadcrumbs.pop();
      }
    }
    // Home => Home->Whatever
    else if (breadcrumbs.length === 1) {
      breadcrumbs.push(event.target.name);
    }
    // Home->Whatever => Home=> Whatever
    else if (breadcrumbs.length === 2) {
      breadcrumbs.pop();
      breadcrumbs.push(event.target.name);
    }
    this.setState({ current: event.target.name, breadcrumbs });
  };

  loadContent = () => {
    switch (this.state.current) {
      case "Add a Review":
        return (
          <div className="content__solo-add">
            <div className="solo-add__image">
              <i className="fas fa-plus-square fa-7x" />
            </div>
            <div className="solo-add__text">Add a review</div>
          </div>
        );
      case "My Reviews":
        return (
          <div className="content__user-reviews">
            {this.state.userReviews.map((review, i) => {
              return (
                /* Cheap workaround until we have review ids / hook up to the back end */
                <div key={i} className="user-reviews__item">
                  <div className="item__image">image</div>
                  <div className="item__info">{review.business}</div>
                  <div className="item__info">{review.businessType}</div>
                  <div className="item__info">{review.street}</div>
                  <div className="item__info">{review.city}</div>
                  <div className="item__info">Last Updated: {review.updated}</div>
                </div>
              );
            })}
            <div className="user-reviews__add">
              <div className="add__image">
                <i className="fas fa-plus-square fa-5x" />
              </div>
              <div className="add__text">Add a review</div>
            </div>
          </div>
        );
      case "Billing":
        return <div className="content__billing">No idea what will go here, I guess something for Stripe?</div>;
      case "Settings":
        return (
          <div className="content__profile">
            <div className="profile__image" />
            {/* Have this open a modal to change their password */}
            <div className="profile__container">
              <div className="container__info">
                <div className="info__label">Username:</div>
                <div className="info__data">
                  {this.state.openForChange ? (
                    <input
                      className="user-change__input"
                      placeholder="username"
                      name="username"
                      type="text"
                      value={this.state.username}
                      onChange={this.handleInputChange}
                    />
                  ) : (
                    //Show save but when change button is clicked
                    this.state.username
                  )}{" "}
                  {this.state.change ? (
                    <button className="info__button" onClick={this.saveUsernameOrEmail}>
                      Save
                    </button>
                  ) : null}
                </div>
                <button className="info__button" onClick={this.changeUsernameOrEmail}>
                  {this.state.currenAction}
                </button>
              </div>
              <div className="container__info">
                <div className="info__label">Email:</div>
                <div className="info__data">
                  {this.state.openForChange ? (
                    <input
                      className="user-change__input"
                      placeholder="email"
                      name="email"
                      type="text"
                      value={this.state.email}
                      onChange={this.handleInputChange}
                    />
                  ) : (
                    //Show save but when change button is clicked
                    this.state.email
                  )}{" "}
                  {this.state.change ? (
                    <button className="info__button" onClick={this.saveUsernameOrEmail}>
                      Save
                    </button>
                  ) : null}
                </div>
                <button className="info__button" onClick={this.changeUsernameOrEmail}>
                  {this.state.currenAction}
                </button>
              </div>
              <div className="container__info">
                <div className="info__label">Password:</div>
                <div className="info__data">****************</div>
                <button className="info__button" onClick={this.changePassword}>
                  Change
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="content__profile">
            <div className="profile__image" />
            {/* Have this open a modal to change their password */}
            <div className="profile__container">
              <div className="container__info">
                <div className="info__label">Username:</div>
                <div className="info__data">{this.state.username}</div>
                {/* <button className="info__button" onClick={this.changeUsername}>
                  Change
                </button> */}
              </div>
              <div className="container__info">
                <div className="info__label">Email:</div>
                <div className="info__data">{this.state.email}</div>
                {/* <button className="info__button" onClick={this.changeEmail}>
                  Change
                </button> */}
              </div>
              <div className="container__info">
                <div className="info__label">Password:</div>
                <div className="info__data">****************</div>
                {/* <button className="info__button" onClick={this.changeUsername}>
                  Change
                </button> */}
              </div>
            </div>
          </div>
        );
    }
  };
}

export default withRouter(User);
