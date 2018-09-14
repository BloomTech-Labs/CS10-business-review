import React, { Component } from 'react';
import Modal from 'react-modal';
import StarRatings from 'react-star-ratings';

import '../css/NewReview.css';

let modalStyles = {
  content: {
    top: '15%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '20%',
    width: '60%',
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

  render() {
    console.log(this.props.open);
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        style={modalStyles}
        contentLabel="New Review Modal">
        <div className="new-review">
          {this.state.modalIsOpen ? (
            <div className="modal-container">
              <div className="modal-container__title">New Review</div>
              <div className="modal-container__body">
                <div className="body__title">
                  Review Title:
                  <div className="title__info"> This place sucks. </div>
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
              <div className="modal-container__footer">
                <button className="footer__button" onClick={this.closeModal}>
                  Submit Review
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

  starRating = rating => {
    this.setState({ rating });
  };
}
