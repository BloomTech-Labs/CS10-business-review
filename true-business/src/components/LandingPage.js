import React, { Component } from 'react';
import Modal from 'react-modal';
import BusinessThumbnail from './BusinessThumbnail';
import StarRatings from 'react-star-ratings';
import axios from 'axios';

import '../css/LandingPage.css';
import '../css/GeneralStyles.css';

import NavBar from './NavBar';

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

Modal.setAppElement('div');

class LandingPage extends Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      modalInfo: null,
      liked: false,
      unliked: false,
      likeError: false,
      likeErrorMessage: '',
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  openModal(event, info) {
    this.setState({ modalIsOpen: true, modalInfo: info });
  }

  closeModal() {
    this.setState({ modalIsOpen: false, liked: false, unliked: false, likeError: false, likeErrorMessage: '' });
  }

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

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        <div className="landing">
          <div className="landing__container">
            <div className="container__header">Popular Reviews</div>
            <div id="containerOne" className="container__items">
              {this.props.reviews.map(review => {
                // Need to write a component that shows all the reviews by a certain user
                // Whenever they click on the username in this section or in the bottom section
                // <div key={review._id} onClick={() => this.props.userReviews(user)}>
                console.log(review);
                return (
                  <div key={review._id} className="items__item" onClick={() => this.openModal(this, review)}>
                    <img
                      alt={review.newMongoId.name}
                      src={review.photos[0].link}
                      className={
                        review.photos[0].width > review.photos[0].height ? 'item__landscape' : 'item__portrait'
                      }
                    />
                    <div className="item__description">
                      <div className="item__title">{review.newMongoId.name}</div>
                      <StarRatings
                        starDimension="20px"
                        starSpacing="5px"
                        rating={review.stars}
                        starRatedColor="gold"
                        starEmptyColor="grey"
                        numberOfStars={5}
                        name="rating"
                      />
                      <div className="item__info">
                        <div className="info__detail">
                          <i style={{ paddingRight: '.5rem' }} className="fas fa-user" /> {review.reviewer.username}
                        </div>
                        <div className="info__detail">
                          <i style={{ paddingRight: '.5rem' }} className="fas fa-thumbs-up" />
                          {review.numberOfLikes}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="landing__container">
            <div className="container__header">Popular Businesses</div>
            <div id="containerTwo" className="container__items">
              {this.props.businesses.map((business, i) => {
                if (i < 4) {
                  return (
                    <BusinessThumbnail getBusiness={this.props.getBusiness} business={business} key={business._id} />
                  );
                }
                return null;
              })}
            </div>
          </div>
          <div className="landing__container">
            <div className="container__header">Popular Reviewers</div>
            <div id="containerThree" className="container__items">
              {this.props.users.map((user, i) => {
                if (i < 4) {
                  return (
                    <div key={user._id} className="items__item" onClick={() => this.props.sendReviewer(user._id)}>
                      <img
                        alt={user.username}
                        src={user.userImages[0].link}
                        className={
                          user.userImages[0].width > user.userImages[0].height ? 'item__landscape' : 'item__portrait'
                        }
                      />
                      <div className="item__description">
                        <div className="item__info">
                          <i style={{ paddingRight: '.5rem' }} className="fas fa-user" />
                          {user.username}
                        </div>
                        <div className="item__info">{user.numberOfReviews} Reviews</div>
                        <div className="item__info">{user.numberOfLikes} Likes</div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
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
    );
  }
}

export default LandingPage;
