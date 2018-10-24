import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import NavBar from './NavBar.js';
import axios from 'axios';
import StarRatings from 'react-star-ratings';
import Modal from 'react-modal';
import { Button, Menu, MenuItem } from '@material-ui/core';

import { Elements, StripeProvider } from 'react-stripe-elements';
import StripePayment from './StripePayment';

import '../css/User.css';

let backend = process.env.REACT_APP_LOCAL_BACKEND;
let heroku = 'https://cryptic-brook-22003.herokuapp.com/';
if (typeof backend !== 'string') {
  backend = heroku;
}

let modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '90vh',
    width: '60vw',
    zIndex: '5',
    backgroundColor: 'rgb(238,238,238)',
    color: 'rgb(5,56,107)',
    overflow: 'hidden',
  },
};

class User extends Component {
  state = {
    current: 'Home',
    currentPage: 0,
    username: '',
    usernameShow: false,
    usernameButton: 'Change',
    usernameUpdate: '',
    usernameError: false,
    email: '',
    emailShow: false,
    emailButton: 'Change',
    emailUpdate: '',
    password: '',
    passwordShow: false,
    passwordButton: 'Change',
    passwordUpdate: '',
    passwordUpdateVerify: '',
    passwordErrorMatch: false,
    passwordErrorLength: false,
    passwordErrorUpdate: false,
    error: false,
    filterBy: 'No Filter',
    sortBy: 'No Sorting',
    anchorElFilter: null,
    anchorElSort: null,
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.getReviews(0, this.state.sortBy, this.state.filterBy);
    const id = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const headers = { headers: { authorization: token } };
    axios
      .get(`${backend}api/user/${id}`, headers)
      .then(response => {
        this.setState({
          username: response.data.username,
          email: response.data.email,
        });
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  updateUser = event => {
    event.preventDefault();
    let field = event.target.name;
    let update =
      field === 'password'
        ? {
            password: this.state.password,
            passwordUpdate: this.state.passwordUpdate,
          }
        : this.state[field + 'Update'];
    let userId = localStorage.getItem('userId');
    axios
      .put(`${backend}api/user/update/${userId}`, { field: field, update })
      .then(response => {
        field === 'password'
          ? this.setState({
              password: '',
              passwordUpdate: '',
              passwordUpdateVerify: '',
              passwordShow: false,
              passwordButton: 'Change',
            })
          : this.setState({
              [field]: response.data[field],
              [field + 'Show']: false,
              [field + 'Button']: 'Change',
            });
      })
      .catch(err => {
        this.setState({
          error: true,
          passwordErrorUpdate: true,
          password: '',
          passwordUpdate: '',
          passwordUpdateVerify: '',
          passwordShow: false,
          passwordButton: 'Change',
        });
      });
  };

  getReviews = (currentPage, sort, filter) => {
    axios
      .get(
        `${backend}api/review/getReviewsByReviewerId/${localStorage.getItem(
          'userId',
        )}/${currentPage}/${filter}/${sort}`,
      )
      .then(response => {
        this.setState({
          reviews: response.data.reviews,
          total: response.data.total,
        });
      })
      .catch(error => {
        console.log('Error', error);
      });
  };

  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('accountType');
    localStorage.removeItem('accountDeactivated');
    localStorage.removeItem('userImage');
    this.props.history.push('/');
  };

  handleInputChange = event => {
    if (event.target.id === 'username') {
      let username = document.getElementById('username').value;
      if (username.length > 20) {
        this.setState({ usernameError: true, error: true });
      } else {
        this.setState({ usernameError: false, error: false });
      }
    }
    this.setState({ [event.target.name]: event.target.value });
  };

  buttonChange = event => {
    switch (event.target.name) {
      case 'emailButton':
        let email = this.state.emailButton === 'Change' ? 'Cancel' : 'Change';
        this.setState({ emailButton: email, emailShow: !this.state.emailShow });
        break;
      case 'usernameButton':
        let username = this.state.usernameButton === 'Change' ? 'Cancel' : 'Change';
        this.setState({ usernameButton: username, usernameShow: !this.state.usernameShow });
        break;
      //password
      default:
        let password = this.state.passwordButton === 'Change' ? 'Cancel' : 'Change';
        this.setState({ passwordButton: password, passwordShow: !this.state.passwordShow });
    }
  };

  toggleDropDown = event => {
    let toggle = event.target.name;
    let other = 'showFilterBy';
    if (toggle === 'showFilterBy') {
      other = 'showSortBy';
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
    event.preventDefault();
    if (
      this.state.passwordUpdate === this.state.passwordUpdateVerify &&
      (this.state.password !== '' || this.state.passwordUpdate !== '')
    ) {
      this.updateUser(event);
      this.setState({ passwordErrorMatch: false, passwordErrorLength: false, error: false });
    } else if (
      this.state.password === '' ||
      this.state.passwordUpdate === '' ||
      this.state.passwordUpdateVerify === ''
    ) {
      this.setState({ passwordErrorLength: true, error: true });
    } else {
      this.setState({ passwordErrorMatch: true, error: true });
    }
  };

  updateCurrent = event => {
    this.setState({
      current: event.target.name,
      passwordErrorLength: false,
      passwordErrorMatch: false,
      passwordErrorUpdate: false,
      error: false,
      emailShow: false,
      emailUpdate: '',
      usernameShow: false,
      usernameUpdate: '',
      passwordShow: false,
      passwordUpdate: '',
      passwordUpdateVerify: '',
    });
  };

  createPagination = () => {
    let lastPage =
      // Ex. 100 / 10 % 1 = 0
      // Ex. 101 / 10 % 1 != 0
      (this.state.total / 9) % 1 === 0
        ? // 100 / 10 - 1 = 9, so pages 0-9 will show results 0-99 (10 pages, 10 each page)
          Math.floor(this.state.total / 9) - 1
        : // 101 / 10 = 10, so pages 0-10 will show results 0-100 (11 pages, 1 on the last page)
          Math.floor(this.state.total / 9);

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
        pages.splice(1, 0, '...');
      }

      // Add an elipsis if more than 3 away from the last page
      if (this.state.currentPage < lastPage - 2) {
        pages.splice(pages.length - 1, 0, '...');
      }
    }
    return pages.length > 1 ? (
      <div className="reviews__pagination">
        Page {this.state.currentPage + 1} / {lastPage + 1}
        <div id="pagination" className="pagination__pages">
          {pages.map((page, i) => {
            if (page === '...') {
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

  openImage = event => {
    var newTab = window.open();
    let image = document.createElement('img');
    image.src = event.target.src;
    image.classList.add('image__landscape');
    setTimeout(() => {
      newTab.document.body.appendChild(image);
    }, 100);
  };

  updatePage = currentPage => {
    this.setState({ currentPage });
    this.getReviews(currentPage, this.state.sortBy, this.state.filterBy);
  };

  openModal = (event, info) => {
    this.setState({ modalIsOpen: true, modalInfo: info });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  sort = sortBy => {
    this.handleClose('anchorElSort');
    this.setState({ sortBy, currentPage: 0 });
    this.getReviews(0, sortBy, this.state.filterBy);
  };

  filter = filterBy => {
    this.handleClose('anchorElFilter');
    this.setState({ filterBy, currentPage: 0 });
    this.getReviews(0, this.state.sortBy, filterBy);
  };

  handleClick = (type, event) => {
    event.preventDefault();
    this.setState({ [type]: event.currentTarget });
  };

  handleClose = type => {
    this.setState({ [type]: null });
  };

  loadContent = () => {
    switch (this.state.current) {
      case 'My Reviews':
        return (
          <div>
            <div className="content__reviews-container">
              <div className="reviews-container__dropdowns">
                <div className="dropdowns__dropdown">
                  <div className="dropdown__title"> FILTER </div>
                  <Button
                    aria-owns={this.state.anchorElFilter ? 'filter' : null}
                    aria-haspopup="true"
                    onClick={this.handleClick.bind(this, 'anchorElFilter')}>
                    {this.state.filterBy}
                  </Button>
                  <Menu
                    id="filter"
                    style={{ top: '3rem', left: '1rem' }}
                    anchorEl={this.state.anchorElFilter}
                    open={Boolean(this.state.anchorElFilter)}
                    onClose={this.handleClose}>
                    <MenuItem onClick={this.filter.bind(this, 'No Filter')}>NO FILTER</MenuItem>
                    <MenuItem onClick={this.filter.bind(this, '5 Stars')}>5 STARS</MenuItem>
                    <MenuItem onClick={this.filter.bind(this, '4 Stars')}>4 STARS</MenuItem>
                    <MenuItem onClick={this.filter.bind(this, '3 Stars')}>3 STARS</MenuItem>
                    <MenuItem onClick={this.filter.bind(this, '2 Stars')}>2 STARS</MenuItem>
                    <MenuItem onClick={this.filter.bind(this, '1 Stars')}>1 STARS</MenuItem>
                  </Menu>
                </div>
                <div className="dropdowns__dropdown">
                  <div className="dropdown__title"> SORT </div>
                  <div className="dropdown__drop-container">
                    <Button
                      aria-owns={this.state.anchorElSort ? 'sort' : null}
                      aria-haspopup="true"
                      onClick={this.handleClick.bind(this, 'anchorElSort')}>
                      {this.state.sortBy}
                    </Button>
                    <Menu
                      id="sort"
                      style={{ top: '3rem', left: '1rem' }}
                      anchorEl={this.state.anchorElSort}
                      open={Boolean(this.state.anchorElSort)}
                      onClose={this.handleClose}>
                      <MenuItem onClick={this.sort.bind(this, 'No Sorting')}>NO SORTING</MenuItem>
                      <MenuItem onClick={this.sort.bind(this, 'Rating Ascending')}>RATING ASCENDING</MenuItem>
                      <MenuItem onClick={this.sort.bind(this, 'Rating Descending')}>RATING DESCENDING</MenuItem>
                      <MenuItem onClick={this.sort.bind(this, 'Date Ascending')}>DATE ASCENDING</MenuItem>
                      <MenuItem onClick={this.sort.bind(this, 'Date Descending')}>DATE DESCENDING</MenuItem>
                    </Menu>
                  </div>
                </div>
                {this.state.total > 8 ? this.createPagination() : null}
              </div>
              <div className="reviews-container__reviews">
                {/* onClick should render a modal that shows the review, similar to the landing page */}
                <div className="reviews__review">
                  {this.state.reviews.length ? (
                    this.state.reviews.map((review, i) => {
                      return (
                        <div key={review._id} className="review__info" onClick={() => this.openModal(this, review)}>
                          <img
                            alt={review.reviewer.username}
                            className="review__landscape"
                            src={review.photos[0].link}
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
              {this.state.modalIsOpen ? (
                <div className="modal">
                  <div className="modal__header">
                    <div className="header__image">
                      {/* Update reviews / user with likes */}
                      <div className="image__buttons" />
                      <a href={this.state.modalInfo.photos[0].link} target="_blank">
                        <img
                          alt={this.state.modalInfo.reviewer.name}
                          className={
                            this.state.modalInfo.photos[0].width > this.state.modalInfo.photos[0].height
                              ? 'image__landscape'
                              : 'image__portrait'
                          }
                          src={this.state.modalInfo.photos[0].link}
                        />
                      </a>
                      <div className="image__buttons">
                        <button className="image__button" onClick={this.closeModal}>
                          <i className="far fa-window-close" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="modal__body">
                    <div className="body__stars">
                      <div className="body__business"> {this.state.modalInfo.newMongoId.name}</div>
                      <StarRatings
                        starDimension="20px"
                        starSpacing="5px"
                        rating={this.state.modalInfo.stars}
                        starRatedColor="gold"
                        starEmptyColor="grey"
                        numberOfStars={5}
                        name="rating"
                      />
                      <div>{this.state.modalInfo.createdOn.replace(/[^\d{4}-\d{2}-\d{2}].*/, '')}</div>
                      <div>
                        <i style={{ paddingRight: '.5rem' }} className="fas fa-user" />
                        {this.state.modalInfo.reviewer.username}
                      </div>
                    </div>
                    <div className="body__title">
                      {this.state.modalInfo.title ? this.state.modalInfo.title : '***Untitled***'}
                    </div>
                    <div className="body__review">
                      {this.state.modalInfo.body ? this.state.modalInfo.body : '***No Body***'}
                    </div>
                  </div>
                </div>
              ) : null}
            </Modal>
          </div>
        );
      case 'Billing':
        return (
          <div className="content__billing">
            <div className="billing__section">
              <div className="section__single">
                <div className="single__info">Current Account Type:</div>
                <div className="single__info">{localStorage.getItem('accountType')}</div>
              </div>
              <div className="section__single">
                <div className="single__info">Account Deactivates:</div>
                <div className="single__info">
                  {localStorage.getItem('accountDeactivated').replace(/[^\d{4}-\d{2}-\d{2}].*/, '')}
                </div>
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
                alt={localStorage.getItem('name')}
                className="profile__image"
                src={localStorage.getItem('userImage')}
              />
              <div className="container__info">
                <div className="info__info">
                  <div className="info__label">Username:</div>
                  <div className="info__data">
                    {this.state.usernameShow ? (
                      <form className="data__change">
                        <input
                          id="username"
                          className="change__input"
                          placeholder={this.state.username}
                          name="usernameUpdate"
                          type="text"
                          value={this.state.usernameUpdate}
                          onChange={this.handleInputChange}
                        />
                        <button type="submit" name="username" className="change__button" onClick={this.updateUser}>
                          Save
                        </button>
                      </form>
                    ) : (
                      this.state.username
                    )}
                  </div>
                  <button name="usernameButton" className="info__button" onClick={this.buttonChange}>
                    {this.state.usernameButton}
                  </button>
                </div>
                <div className="info__info">
                  <div className="info__label">Email:</div>
                  <div className="info__data">
                    {this.state.emailShow ? (
                      <form className="data__change">
                        <input
                          className="change__input"
                          placeholder={this.state.email}
                          name="emailUpdate"
                          value={this.state.emailUpdate}
                          onChange={this.handleInputChange}
                        />
                        <button type="submit" name="email" className="change__button" onClick={this.updateUser}>
                          Save
                        </button>
                      </form>
                    ) : (
                      this.state.email
                    )}
                  </div>
                  <button name="emailButton" className="info__button" onClick={this.buttonChange}>
                    {this.state.emailButton}
                  </button>
                </div>
                <div className="info__info">
                  <div className="info__label">Password:</div>
                  <div id="password" className="info__data">
                    {this.state.passwordShow ? (
                      <form className="data__change">
                        <input
                          className="change__input"
                          placeholder="Password"
                          name="password"
                          type="password"
                          value={this.state.password}
                          onChange={this.handleInputChange}
                        />
                        <input
                          className="change__input"
                          placeholder="New password"
                          name="passwordUpdate"
                          type="password"
                          value={this.state.passwordUpdate}
                          onChange={this.handleInputChange}
                        />
                        <input
                          className="change__input"
                          placeholder="Repeat new password"
                          name="passwordUpdateVerify"
                          type="password"
                          value={this.state.passwordUpdateVerify}
                          onChange={this.handleInputChange}
                        />
                        <button type="submit" name="password" className="change__button" onClick={this.checkPassword}>
                          Save
                        </button>
                      </form>
                    ) : (
                      '****************'
                    )}
                  </div>
                  <button name="passwordButton" className="info__button" onClick={this.buttonChange}>
                    {this.state.passwordButton}
                  </button>
                </div>
              </div>
              {this.state.passwordErrorMatch ? <div className="profile__error"> Passwords Do Not Match </div> : null}
              {this.state.passwordErrorLength ? (
                <div className="profile__error"> Password Must Be At Least 1 Character </div>
              ) : null}
              {this.state.passwordErrorUpdate ? (
                <div className="profile__error"> Original Password Incorrect </div>
              ) : null}
              {this.state.usernameError ? <div className="profile__error"> Username Character Limit of 20 </div> : null}
              {this.state.error ? null : <div className="profile__error" />}
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
              <button className="left-bar__button" name="Home" onClick={this.updateCurrent}>
                Profile
              </button>
              <button className="left-bar__button" name="My Reviews" onClick={this.updateCurrent}>
                My Reviews
              </button>
              <button className="left-bar__button" name="Billing" onClick={this.updateCurrent}>
                Billing
              </button>
              <button className="left-bar__button" onClick={this.logout}>
                Sign Out
              </button>
            </div>
            <div className="body__content">{this.loadContent()}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(User);
