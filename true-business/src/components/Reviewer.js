import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import NavBar from './NavBar.js';
import axios from 'axios';
import StarRatings from 'react-star-ratings';
import Modal from 'react-modal';
import { Button, Menu, MenuItem } from '@material-ui/core';

import '../css/Reviewer.css';

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

class Reviewer extends Component {
  state = {
    reviewer: null,
    reviews: null,
    modalIsOpen: false,
    modalInfo: null,
    liked: false,
    unliked: false,
    likeError: false,
    likeErrorMessage: '',
    currentPage: 0,
    filterBy: 'No Filter',
    sortBy: 'No Sorting',
    anchorElFilter: null,
    anchorElSort: null,
    total: 0,
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.setState({ reviewer: this.props.reviewer, reviews: this.props.reviews });
    this.props.reviewer ? this.getReviews(0, this.state.sortBy, this.state.filterBy, this.props.reviewer._id) : null;
  };

  openModal = (event, info) => {
    this.setState({ modalIsOpen: true, modalInfo: info });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false, liked: false, unliked: false, likeError: false, likeErrorMessage: '' });
  };

  updateLikes = (info, bool, event) => {
    let reviewerId = info.reviewer._id;
    let reviewId = info._id;
    let userId = localStorage.getItem('userId');
    if (localStorage.getItem('token') && userId) {
      axios
        .put(`${backend}api/reviews/updateLikes`, { reviewerId, reviewId, userId, bool })
        .then(() => {
          bool
            ? this.setState({ liked: true, likeError: false, likeErrorMessage: '' })
            : this.setState({ unliked: true, likeError: false, likeErrorMessage: '' });
        })
        .catch(err => {
          this.setState({ likeError: true, likeErrorMessage: err.response.data.errorMessage });
        });
    } else {
      this.setState({ likeError: true, likeErrorMessage: 'Sign In to Like/Dislike' });
    }
  };

  handleClick = (type, event) => {
    event.preventDefault();
    this.setState({ [type]: event.currentTarget });
  };

  handleClose = type => {
    this.setState({ [type]: null });
  };

  getReviews = (currentPage, sort, filter, id=null) => {
    axios
      .get(
        `${backend}api/review/getReviewsByReviewerId/${id ? id : this.state.reviewer._id}/${currentPage}/${filter}/${sort}`,
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

  createPagination = () => {
    let lastPage =
      // Ex. 100 / 10 % 1 = 0
      // Ex. 101 / 10 % 1 != 0
      (this.state.reviewer.numberOfReviews / 9) % 1 === 0
        ? // 100 / 10 - 1 = 9, so pages 0-9 will show results 0-99 (10 pages, 10 each page)
          Math.floor(this.state.reviewer.numberOfReviews / 9) - 1
        : // 101 / 10 = 10, so pages 0-10 will show results 0-100 (11 pages, 1 on the last page)
          Math.floor(this.state.reviewer.numberOfReviews / 9);

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

  updatePage = currentPage => {
    this.setState({ currentPage });
    this.getReviews(currentPage, this.state.sortBy, this.state.filterBy);
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

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        {this.state.reviewer ? (
          <div className="reviewer">
            <div className="reviewer__profile">
              <img
                alt={this.state.reviewer.username}
                className={
                  this.state.reviewer.userImages[0].width > this.state.reviewer.userImages[0].height
                    ? 'profile__landscape'
                    : 'profile__portrait'
                }
                src={this.state.reviewer.userImages[0].link}
              />
              <div className="profile__info">
                <div className="info__details">
                  <i className="fas fa-user" />
                  <div className="details__text">{this.state.reviewer.username}</div>
                </div>
                <div className="info__details">
                  <i className="fas fa-file" />
                  <div className="details__text">{this.state.reviewer.numberOfReviews}</div>
                </div>
                <div className="info__details">
                  <i className="fas fa-thumbs-up" />
                  <div className="details__text">{this.state.reviewer.numberOfLikes}</div>
                </div>
                {console.log('REVIEWER', this.state.reviewer)}
                <div className="info__details">
                  Member Since:
                  <div className="details__text">
                    {this.state.reviewer.accountActivated.replace(/[^\d{4}-\d{2}-\d{2}].*/, '')}
                  </div>
                </div>
              </div>
            </div>
            <div className="reviewer__reviews">
              {/* onClick should render a modal that shows the review, similar to the landing page */}
              <div className="reviews__review">
                <div className="review__dropdowns">
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
                </div>
                {this.state.reviews.length ? (
                  this.state.reviews.map(review => {
                    return (
                      <div key={review._id} className="review__info" onClick={() => this.openModal(this, review)}>
                        <div className="info__header">
                          <div className="header__data">
                            <div className="data__text">{review.title ? review.title : 'No Title'}</div>
                            <div className="data__text">
                              <div style={{ marginRight: '1rem' }}>
                                <StarRatings
                                  starDimension="20px"
                                  starSpacing="5px"
                                  rating={review.stars}
                                  starRatedColor="gold"
                                  starEmptyColor="grey"
                                  numberOfStars={5}
                                  name="rating"
                                />
                              </div>
                              <div>{review.createdOn.replace(/[^\d{4}-\d{2}-\d{2}].*/, '')}</div>
                            </div>
                          </div>
                          <img
                            alt={review.reviewer.username}
                            className={
                              review.photos[0].width > review.photos[0].height
                                ? 'review__landscape'
                                : 'review__portrait'
                            }
                            src={review.photos[0].link}
                          />
                        </div>
                        <div className="info__body">
                          <div className="body__reviewer">
                            <img
                              alt={review.reviewer.userImages[0]}
                              className={
                                review.reviewer.userImages[0].width > review.reviewer.userImages[0].height
                                  ? 'review__landscape'
                                  : 'review__portrait'
                              }
                              src={review.reviewer.userImages[0].link}
                              onClick={() => this.openModal(this, review)}
                            />
                            <div className="reviewer__text">{review.reviewer.username}</div>
                          </div>
                          <div className="body__review">{review.body ? review.body : 'No Review'}</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="reviews--no-results">
                    <div className="no-results__text">No Reviews</div>
                  </div>
                )}
                <div>{this.state.total > 9 ? this.createPagination() : null}</div>
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
                        <div className="image__buttons">
                          {!this.state.unliked ? (
                            <button
                              className="image__button"
                              onClick={this.updateLikes.bind(this, this.state.modalInfo, true)}>
                              {this.state.liked ? (
                                <div>
                                  <i style={{ marginRight: '.5rem' }} className="fas fa-thumbs-up" />
                                  <i className="fas fa-check" />
                                </div>
                              ) : (
                                <i className="fas fa-thumbs-up" />
                              )}
                            </button>
                          ) : null}
                          {!this.state.liked ? (
                            <button
                              className="image__button"
                              onClick={this.updateLikes.bind(this, this.state.modalInfo, false)}>
                              {this.state.unliked ? (
                                <div>
                                  <i style={{ marginRight: '.5rem' }} className="fas fa-thumbs-down" />
                                  <i className="fas fa-check" />
                                </div>
                              ) : (
                                <i className="fas fa-thumbs-down" />
                              )}
                            </button>
                          ) : null}
                          {this.state.likeError ? (
                            <div style={{ color: 'red', fontSize: '.8rem' }}>{this.state.likeErrorMessage}</div>
                          ) : null}
                        </div>
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
          </div>
        ) : (
          <div className="reviewer--empty"> Reviewer Not Found </div>
        )}
      </div>
    );
  }
}

export default withRouter(Reviewer);
