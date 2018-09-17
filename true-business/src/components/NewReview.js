import React, { Component } from 'react';
import Modal from 'react-modal';
import StarRatings from 'react-star-ratings';

import '../css/NewReview.css';

let modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '90%',
    width: '75%',
    zIndex: '5',
    backgroundColor: 'darkslategrey',
    overflow: 'hidden',
  },
};

Modal.setAppElement('div');

export default class NewReview extends Component {
  constructor() {
    super();

    this.state = {
      rating: 0,
      modalIsOpen: false,
      modalInfo: null,
    };

    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  componentDidUpdate = () => {
    if (this.state.modalIsOpen !== this.props.open) {
      this.openModal();
    }
  };

  openModal() {
    this.setState({ modalIsOpen: this.props.open });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
    this.props.showModal(false);
  }

  starRating = rating => {
    this.setState({ rating });
  };

  submiteReview = () => {
    this.closeModal();
    // I'll focus on this after we do some db stuff
  };

  render() {
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        style={modalStyles}
        contentLabel="New Review Modal">
        <div className="new-review">
          {this.state.modalIsOpen ? (
            <div className="new-review__modal">
              <div className="modal__header">New Review</div>
              <div className="modal__body">
                <div className="body__image">
                  <i className="image__add fas fa-plus-square fa-5x" />
                  <div className="image__text">Add an Image</div>
                </div>
                <div className="body__title">
                  <div className="title__label">Title:</div>
                  <input className="title__info" />
                </div>
                <div className="body__review">
                  <div className="review__label">Review:</div>
                  <textarea className="review__info" />
                </div>
                <div className="body__stars">
                  Star Rating:
                  <div className="stars__rating">
                    <StarRatings
                      rating={this.state.rating}
                      starRatedColor="gold"
                      changeRating={this.starRating}
                      numberOfStars={5}
                      name="rating"
                    />
                  </div>
                </div>
              </div>
              <div className="modal__footer">
                <button className="footer__button" onClick={this.submitReview}>
                  Submit
                </button>
                <button className="footer__button" onClick={this.closeModal}>
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
    );
  }
}
