import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NavBar from "./NavBar.js";
import axios from "axios";
import StarRatings from "react-star-ratings";
import Modal from "react-modal";

import { Elements, StripeProvider } from "react-stripe-elements";
import StripePayment from "./StripePayment";

import "../css/User.css";

let backend = process.env.REACT_APP_LOCAL_BACKEND;
let heroku = "https://cryptic-brook-22003.herokuapp.com/";
if (typeof backend !== "string") {
  backend = heroku;
}

let modalStyles = {
  content: {
    top: "15%",
    left: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "20vh",
    width: "55vw",
    zIndex: "5",
    backgroundColor: "rgb(238,238,238)",
    color: "rgb(5,56,107)",
    overflow: "hidden",
  },
};

class User extends Component {
  state = {
    current: "Home",
    currentPage: 0,
    username: "",
    usernameShow: false,
    usernameButton: "Change",
    usernameUpdate: "",
    email: "",
    emailShow: false,
    emailButton: "Change",
    emailUpdate: "",
    password: "",
    passwordShow: false,
    passwordButton: "Change",
    passwordUpdate: "",
    passwordUpdateVerify: "",
    passwordError: false,
    filter: ["No Filter", "4 Stars or Higher", "3 Stars or Higher", "2 Stars or Higher"],
    sort: ["Date Descending", "Date Ascending", "Rating Descending", "Rating Ascending"],
    fitlerBy: "No Filter",
    sortBy: "Date Descending",
    showFilterBy: false,
    showSortBy: false,
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.getReviews(0);
    const id = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const headers = { headers: { authorization: token } };
    axios.get(`${backend}api/user/${id}`, headers).then(response => {
      console.log("response", response);
      this.setState({
        username: response.data.username,
        email: response.data.email,
      });
    });
  };

  updateUser = event => {
    let update = this.state[event.target.name];
    let userId = localStorage.getItem("userId");
    axios
      .put(`${backend}api/user/update/${userId}`, { field: event.target.name, update })
      .then(response => {
        console.log("SaveResponse", response);
        this.setState({
          openForChange: false,
          currenAction: "Change",
          change: false,
        });
      })
      .catch(err => {
        console.log("Update Error", err);
      });
  };

  getReviews = currentPage => {
    axios
      .get(`${backend}api/review/getReviewsByReviewerId/${localStorage.getItem("userId")}/${currentPage}`)
      .then(response => {
        this.setState({
          reviews: response.data.reviews,
          total: response.data.total,
        });
      })
      .catch(error => {
        console.log("Error", error);
      });
  };

  logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("accountType");
    localStorage.removeItem("accountDeactivated");
    localStorage.removeItem("userImage");
    this.props.history.push("/");
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  buttonChange = () => {
    this.setState({ [event.target.name]: !this.state[event.target.name] });
  };

  updateCurrent = event => {
    this.setState({ current: event.target.name });
  };

  toggleDropDown = event => {
    let toggle = event.target.name;
    let other = "showFilterBy";
    if (toggle === "showFilterBy") {
      other = "showSortBy";
    }
    let inverse = this.state[toggle];
    this.setState({ [toggle]: !inverse, [other]: false });
  };

  toggleFilterChoice = event => {
    let toggle = event.target.name;
    this.setState({ filterBy: toggle, showFilterBy: false });
  };

  toggleSortChoice = event => {
    let toggle = event.target.name;
    this.setState({ sortBy: toggle, showSortBy: false });
  };

  checkPassword = event => {
    if (this.state.passwordUpdate === this.state.passwordUpdateVerify) {
      this.updateUser(event);
      this.setState({ passwordError: false });
    } else {
      this.setState({ passwordError: true });
    }
  };

  loadContent = () => {
    switch (this.state.current) {
      case "My Reviews":
        return (
          <div>
            <div className="content__reviews-container">
              <div className="reviews-container__dropdowns">
                <div className="dropdowns__dropdown">
                  <div className="dropdown__drop-container">
                    Filter
                    <button className="drop-container__button" name="showFilterBy" onClick={this.toggleDropDown}>
                      {this.state.filterBy}
                    </button>
                    {this.state.showFilterBy ? (
                      <div className="drop-container__menu">
                        {this.state.filter.map(type => {
                          <button onClick={this.toggleFilterChoice} name={type} className="menu__button">
                            {type}
                          </button>;
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="dropdowns__dropdown">
                  <div className="dropdown__drop-container">
                    Sort
                    <button className="drop-container__button" name="showSortBy" onClick={this.toggleDropDown}>
                      {this.state.sortBy}
                    </button>
                    {this.state.showSortBy ? (
                      <div className="drop-container__menu">
                        {this.state.sort.map(type => {
                          <button onClick={this.toggleFilterChoice} name={type} className="menu__button">
                            {type}
                          </button>;
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div>{this.state.reviews.length > 10 ? this.createPagination() : null}</div>
              </div>
              <div className="reviews-container__reviews">
                {/* onClick should render a modal that shows the review, similar to the landing page */}
                <div className="reviews__review">
                  {this.state.reviews.length ? (
                    this.state.reviews.map((review, i) => {
                      return (
                        <div key={review._id} className="review__info">
                          <img
                            alt={review.reviewer.username}
                            className="review__landscape"
                            src={review.photos[0].link}
                            onClick={() => this.openModal(this, review)}
                          />
                          <div className="info__detailed">
                            <StarRatings
                              className="detailed__stars"
                              starDimension="20px"
                              starSpacing="5px"
                              rating={review.stars}
                              starRatedColor="gold"
                              starEmptyColor="grey"
                              numberOfStars={5}
                              name="rating"
                            />
                            <div className="detailed__business">{review.newMongoId.name}</div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div>No Reviews</div>
                  )}
                </div>
              </div>
            </div>
            <Modal
              shouldCloseOnOverlayClick={false}
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              style={modalStyles}
              contentLabel="Review Modal">
              <div className="landing-container__modal">
                {this.state.modalIsOpen ? (
                  <div className="modal-container">
                    <div className="modal__header">
                      <div className="header__title">{this.state.modalInfo.newMongoId.name}</div>
                      <div className="header__reviewer">@{this.state.modalInfo.reviewer.username}</div>
                    </div>
                    <div className="modal__body">
                      <img
                        alt={this.state.modalInfo.name}
                        className="body__landscape"
                        src={this.state.modalInfo.photos[0].link}
                        onClick={this.openModal}
                      />
                      <div className="body__stars">
                        <StarRatings
                          starDimension="20px"
                          starSpacing="5px"
                          rating={this.state.modalInfo.stars}
                          starRatedColor="gold"
                          starEmptyColor="grey"
                          numberOfStars={5}
                          name="rating"
                        />
                      </div>
                      <div>{this.state.modalInfo.title}</div>
                      <div className="body__review">{this.state.modalInfo.body}</div>
                    </div>
                    <div className="modal__footer">
                      <button className="footer__button" onClick={this.closeModal}>
                        close
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </Modal>
          </div>
        );
      case "Settings":
        return (
          <div className="content__profile">
            <img
              alt={localStorage.getItem("name")}
              className="profile__image"
              src={localStorage.getItem("userImage")}
            />
            <div className="profile__container">
              <div className="container__info">
                <div className="info__label">Username:</div>
                <div className="info__data">
                  {this.state.usernameShow ? (
                    <form className="data__change">
                      <input
                        className="change__input"
                        placeholder={this.state.username}
                        name="usernameUpdate"
                        type="text"
                        value={this.state.username}
                        onChange={this.handleInputChange}
                      />
                      <button type="submit" name="usernameUpdate" className="change__button" onClick={this.updateUser}>
                        Save
                      </button>
                    </form>
                  ) : (
                    this.state.username
                  )}
                </div>
              </div>
              <div className="container__info">
                <div className="info__label">Email:</div>
                <div className="info__data">
                  {this.state.emailShow ? (
                    <form className="data__change">
                      <input
                        className="change__input"
                        placeholder={this.state.email}
                        name="emailUpdate"
                        value={this.state.email}
                        onChange={this.handleInputChange}
                      />
                      <button type="submit" name="emailUpdate" className="change__button" onClick={this.updateUser}>
                        Save
                      </button>
                    </form>
                  ) : (
                    this.state.username
                  )}
                </div>
              </div>
              <div className="container__info">
                <div className="info__label">Password:</div>
                <div id="password" className="info__data">
                  {this.state.usernameShow ? (
                    <form className="data__change">
                      <input
                        className="password-change__input"
                        placeholder="Password"
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleInputChange}
                      />
                      <input
                        className="password-change__input"
                        placeholder="New password"
                        name="passwordUpdate"
                        type="password"
                        value={this.state.passwordUpdate}
                        onChange={this.handleInputChange}
                      />
                      <input
                        className="password-change__input"
                        placeholder="Repeat new password"
                        name="passwordUpdateVerify"
                        type="password"
                        value={this.state.passwordUpdateVerify}
                        onChange={this.handleInputChange}
                      />
                      <button
                        type="submit"
                        name="passwordUpdate"
                        className="change__button"
                        onClick={this.checkPassword.bind(this)}>
                        Save
                      </button>
                    </form>
                  ) : (
                    this.state.username
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case "Billing":
        return (
          <div className="content__billing">
            <div className="billing__section">
              <div className="billing__info">Account Type:</div>
              <div className="billing__info">{localStorage.getItem("accountType")}</div>
            </div>
            <div className="billing__section">
              <div className="billing__info">Account Deactivates:</div>
              <div className="billing__info">
                {localStorage.getItem("accountDeactivated").replace(/[^\d{4}-\d{2}-\d{2}].*/, "")}
              </div>
            </div>
            <StripeProvider apiKey="pk_test_a80QBoWXww54ttxUn5cMQO1o">
              <div className="signup-container__stripe">
                <Elements>
                  <StripePayment checkPayment={this.checkPayment} />
                </Elements>
              </div>
            </StripeProvider>
          </div>
        );
      default:
        return (
          <div className="content__profile">
            <div className="profile__container">
              <img
                alt={localStorage.getItem("name")}
                className="profile__image"
                src={localStorage.getItem("userImage")}
              />
              <div className="container__info">
                <div className="info__label">Username:</div>
                <div className="info__data">{this.state.username}</div>
              </div>
              <div className="container__info">
                <div className="info__label">Email:</div>
                <div className="info__data">{this.state.email}</div>
              </div>
              <div className="container__info">
                <div className="info__label">Password:</div>
                <div className="info__data">****************</div>
              </div>
            </div>
          </div>
        );
    }
  };

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        <div className="user">
          <div className="user__body">
            <div className="body__left-bar">
              <button className="left-bar__button" name="My Reviews" onClick={this.updateCurrent}>
                My Reviews
              </button>
              <button className="left-bar__button" name="Billing" onClick={this.updateCurrent}>
                Billing
              </button>
              <button className="left-bar__button" name="Settings" onClick={this.updateCurrent}>
                Settings
              </button>
              <div className="header__signout" onClick={this.logout}>
                Sign Out
              </div>
            </div>
            <div className="body__content">{this.loadContent()}</div>
          </div>
        </div>
      </div>
    );
  }
}
