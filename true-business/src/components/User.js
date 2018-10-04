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
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "75%",
    width: "50%",
    zIndex: "5",
    backgroundColor: "rgb(238,238,238)",
    color: "rgb(5,56,107)",
  },
};

class User extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    newPassword: "",
    verifyPassword: "",
    editUsernameOrEmail: false,
    changePassword: false,
    opendPasswordForm: false,
    passwordAction: "Change",
    Email: false,
    editPassword: false,
    currentActionUsername: "Change",
    currentActionEmail: "Change",
    currentActionPassword: "Change",
    change: false,
    breadcrumbs: ["Home"],
    current: "Home",
    dropdownOpenFilter: false,
    dropdownOpenSort: false,
    filterBy: "No Filter",
    showfilterBy: false,
    sortBy: "Date Descending",
    showsortBy: false,
    businessID: null,
    newBusinessId: null,
    reviews: [],
    modalIsOpen: false,
    modalInfo: null,
    currentPage: 0,
    openForChangePassword: false,
    openForChangeEmail: false,
    changeEmail: false,
    openForChangeUsername: false,
    changeUsername: false,
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    console.log("localStore", localStorage);
    setTimeout(() => {
      this.getReviews(0);
      const id = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      const headers = { headers: { authorization: token } };
      axios.get(`${backend}api/user/${id}`, headers).then(response => {
        console.log("AXIOS RESPONSE", response)
        this.setState({
          username: response.data.username,
          email: response.data.email,
        });
      });
      console.log("localStore in timeout", localStorage);
    }, 300);
    console.log("localStore after timeout", localStorage);
  };

  getReviews = currentPage => {
    console.log("YUP");
    axios
      .get(`${backend}api/review/getReviewsByReviewerId/${localStorage.getItem("userId")}/${currentPage}`)
      .then(response => {
        console.log("RESPONSE MOFO", response);
        this.setState({
          reviews: response.data.reviews,
          total: response.data.total,
        });
      })
      .catch(error => {
        console.log("Error", error);
      });
  };

  changePassword = currenPage => {
    const user = {
      password: this.state.password,
      newPassword: this.state.newPassword,
      verifyPassword: this.state.verifyPassword,
    };
    const id = localStorage.getItem("userId");
    axios
      .put(`${backend}api/user/${id}/`, user)
      .then(response => {
        this.setState({
          opendPasswordForm: false,
          passwordAction: "Change",
          changePassword: false,
        });
      })
      .catch(err => {
        console.log("Password Reset Error", err);
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

  changeCurrentActionUsername = () => {
    if (this.state.changeUsername) {
      this.setState({
        currenActionUsername: "Change",
      });
    } else {
      this.setState({
        currenActionUsername: "Cancel",
      });
    }
  };
  changeCurrentActionPassword = () => {
    if (this.state.changePassword) {
      this.setState({
        currenActionPassword: "Change",
      });
    } else {
      this.setState({
        currenActionPassword: "Cancel",
      });
    }
  };
  changeCurrentActionEmail = () => {
    if (this.state.changeEmail) {
      this.setState({
        currenActionEmail: "Change",
      });
    } else {
      this.setState({
        currenActionEmail: "Cancel",
      });
    }
  };

  changeUsername = () => {
    this.changeCurrentActionUsername();
    this.setState({
      openForChangeUsername: !this.state.openForChangeUsername,
      changeUsername: !this.state.changeUsername,
    });
  };

  changeEmail = () => {
    this.changeCurrentActionEmail();
    this.setState({
      openForChangeEmail: !this.state.openForChangeEmail,
      changeEmail: !this.state.changeEmail,
    });
  };

  passwordChangeCurrentAction = () => {
    if (this.state.changePassword) {
      this.setState({
        passwordAction: "Change",
      });
    } else {
      this.setState({
        passwordAction: "Cancel",
      });
    }
  };

  changePasswordfunc = () => {
    this.passwordChangeCurrentAction();
    this.setState({
      opendPasswordForm: !this.state.opendPasswordForm,
      changePassword: !this.state.changePassword,
    });
  };

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
    this.setState({ current: event.target.name, breadcrumbs, showfilterBy: false, showsortBy: false });
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
                  <div key={i}>
                    <button name={crumb} onClick={this.updateCurrent} className="breadcrumbs__breadcrumb">
                      {crumb}
                    </button>
                    <i className="fas fa-arrow-right" />
                  </div>
                );
              })}
            </div>
            <button className="header__signout" onClick={this.logout}>
              Sign Out
            </button>
          </div>
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
            </div>
            <div className="body__content">{this.loadContent()}</div>
            <div className="body__footer"> </div>
          </div>
        </div>
      </div>
    );
  }

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
                    <button className="drop-container__button" name="showfilterBy" onClick={this.toggleDropDown}>
                      {this.state.filterBy}
                    </button>
                    {this.state.showfilterBy ? (
                      <div className="drop-container__menu">
                        <button onClick={this.toggleFilterChoice} name="No Filter" className="menu__button">
                          No Filter
                        </button>
                        <button onClick={this.toggleFilterChoice} name="4 Stars or Higher" className="menu__button">
                          4 Stars or Higher
                        </button>
                        <button onClick={this.toggleFilterChoice} name="3 Stars or Higher" className="menu__button">
                          3 Stars or Higher
                        </button>
                        <button onClick={this.toggleFilterChoice} name="2 Stars or Higher" className="menu__button">
                          2 Stars or Higher
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="dropdowns__dropdown">
                  <div className="dropdown__drop-container">
                    Sort
                    <button className="drop-container__button" name="showsortBy" onClick={this.toggleDropDown}>
                      {this.state.sortBy}
                    </button>
                    {this.state.showsortBy ? (
                      <div className="drop-container__menu">
                        <button onClick={this.toggleSortChoice} name="Date Descending" className="menu__button">
                          Date Descending
                        </button>
                        <button onClick={this.toggleSortChoice} name="Date Ascending" className="menu__button">
                          Date Ascending
                        </button>
                        <button onClick={this.toggleSortChoice} name="Rating Descending" className="menu__button">
                          Rating Descending
                        </button>
                        <button onClick={this.toggleSortChoice} name="Rating Descending" className="menu__button">
                          Rating Descending
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div>{this.createPagination()}</div>
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
      case "Settings":
        return (
          <div className="content__profile">
            <img
              alt={localStorage.getItem("name")}
              className="profile__image"
              src={localStorage.getItem("userImage")}
            />
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
                  )}
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
                  )}
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
                <div className="info__data">
                  {this.state.opendPasswordForm ? (
                    <div className="password-reset">
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
                        name="newPassword"
                        type="password"
                        value={this.state.newPassword}
                        onChange={this.handleInputChange}
                      />
                      <input
                        className="password-change__input"
                        placeholder="Repeat new password"
                        name="verifyPassword"
                        type="password"
                        value={this.state.verifyPassword}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  ) : (
                    <div>****************</div>
                  )}
                  {this.state.changePassword ? (
                    <button className="info__button" onClick={this.changePassword}>
                      Save
                    </button>
                  ) : null}
                </div>
                <button className="info__button" onClick={this.changePasswordfunc}>
                  {this.state.passwordAction}
                </button>
              </div>
            </div>
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

  updatePage = currentPage => {
    this.setState({ currentPage });
    this.getReviews(currentPage);
  };

  createPagination = () => {
    let lastPage =
      // Ex. 100 / 10 % 1 = 0
      // Ex. 101 / 10 % 1 != 0
      (this.state.total / 10) % 1 === 0
        ? // 100 / 10 - 1 = 9, so pages 0-9 will show results 0-99 (10 pages, 10 each page)
          Math.floor(this.state.total / 10) - 1
        : // 101 / 10 = 10, so pages 0-10 will show results 0-100 (11 pages, 1 on the last page)
          Math.floor(this.state.total / 10);

    // Set is the lazy / quick way if there is only one page
    let pages = new Set([0, lastPage]);
    if (lastPage < 7) {
      for (let i = 1; i < lastPage; i++) {
        pages.add(i);
      }
      pages = [...pages].sort((a, b) => a - b);
    } else {
      // Load the appropriate pages
      // current:1 	1 2 ... 10
      // current:2	1 2 3 ... 10
      // current:3	1 2 3 4 ... 10
      // current:4	1 ... 3 4 5 ... 10
      // current:5	1 ... 4 5 6 ... 10
      // current:6	1 ... 5 6 7 ... 10
      // current:7	1 ... 6 7 8 ... 10
      // current:8	1 ... 7 8 9 10
      // current:9	1 ... 8 9 10
      // current:10	1 ... 9 10
      for (let i = 1; i < lastPage; i++) {
        if (i <= this.state.currentPage + 1 && i >= this.state.currentPage - 1) {
          pages.add(i);
        }
      }

      pages = [...pages].sort((a, b) => a - b);
      // Add an elipsis if more than 3 away from the first page
      if (this.state.currentPage > 2) {
        pages.splice(1, 0, "...");
      }

      // Add an elipsis if more than 3 away from the last page
      if (this.state.currentPage < lastPage - 2) {
        pages.splice(pages.length - 1, 0, "...");
      }
    }

    return pages.length > 1 ? (
      <div className="reviews__pagination">
        Page {this.state.currentPage + 1} / {lastPage + 1}
        <div id="pagination" className="pagination__pages">
          {pages.map((page, i) => {
            if (page === "...") {
              return (
                <button key={i + page} id={page} className="pagination__page--no-hover">
                  {page}
                </button>
              );
            }
            return (
              <button key={page} id={page} className="pagination__page" onClick={this.updatePage.bind(this, page)}>
                {page + 1}
              </button>
            );
          })}
        </div>
      </div>
    ) : null;
  };

  toggleDropDown = event => {
    let toggle = event.target.name;
    let other = "showfilterBy";
    if (toggle === "showfilterBy") {
      other = "showsortBy";
    }
    let inverse = this.state[toggle];
    this.setState({ [toggle]: !inverse, [other]: false });
  };

  toggleFilterChoice = event => {
    let toggle = event.target.name;
    this.setState({ filterBy: toggle, showfilterBy: false });
  };

  toggleSortChoice = event => {
    let toggle = event.target.name;
    this.setState({ sortBy: toggle, showsortBy: false });
  };
}

export default withRouter(User);
