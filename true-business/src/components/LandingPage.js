import React, { Component } from 'react';
import Modal from 'react-modal';

import '../css/LandingPage.css';

import NavBar from './NavBar';

var customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '75%',
    width: '50%',
    overflow: 'scroll'
  },
};

Modal.setAppElement('div');

class LandingPage extends Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      modalInfo: null,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal(info, event) {
    this.setState({ modalIsOpen: true, modalInfo: info });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
    console.log(this.state.modalInfo.title);
  }

  render() {
    return (
      <div>
        <NavBar id="navbar" />
        <div className="landing-container">
          <div className="landing-container__reviews-container">
            <div className="landing-container__title">Featured Reviews</div>
            <div className="landing-container__reviews">
              <div className="landing-container__review">
                <div id="picture1" className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">Stars</ul>
                <ul className="landing-container__item">Restaurant Name</ul>
                <ul className="landing-container__item">Restaurant Type</ul>
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
              <div className="landing-container__review">
                <div
                  className="landing-container__picture"
                  onClick={this.openModal.bind(this, {
                    title: 'review title',
                    reviewer: '@reviewer',
                    image: 'image',
                    stars: 'stars',
                    review: 'review',
                  })}
                />
                <ul className="landing-container__item--hover">Stars</ul>
                <ul className="landing-container__item">Restaurant Name</ul>
                <ul className="landing-container__item">Restaurant Type</ul>
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">Stars</ul>
                <ul className="landing-container__item">Restaurant Name</ul>
                <ul className="landing-container__item">Restaurant Type</ul>
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">Stars</ul>
                <ul className="landing-container__item">Restaurant Name</ul>
                <ul className="landing-container__item">Restaurant Type</ul>
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
            </div>
          </div>
          <div className="landing-container__reviews-container">
            <div className="landing-container__title">Popular Businesses</div>
            <div className="landing-container__reviews">
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">Stars</ul>
                <ul className="landing-container__item">Restaurant Name</ul>
                <ul className="landing-container__item">Restaurant Type</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">Stars</ul>
                <ul className="landing-container__item">Restaurant Name</ul>
                <ul className="landing-container__item">Restaurant Type</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">Stars</ul>
                <ul className="landing-container__item">Restaurant Name</ul>
                <ul className="landing-container__item">Restaurant Type</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">Stars</ul>
                <ul className="landing-container__item">Restaurant Name</ul>
                <ul className="landing-container__item">Restaurant Type</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">Stars</ul>
                <ul className="landing-container__item">Restaurant Name</ul>
                <ul className="landing-container__item">Restaurant Type</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">Stars</ul>
                <ul className="landing-container__item">Restaurant Name</ul>
                <ul className="landing-container__item">Restaurant Type</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">Stars</ul>
                <ul className="landing-container__item">Restaurant Name</ul>
                <ul className="landing-container__item">Restaurant Type</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">Stars</ul>
                <ul className="landing-container__item">Restaurant Name</ul>
                <ul className="landing-container__item">Restaurant Type</ul>
              </div>
            </div>
          </div>
          <div className="landing-container__reviews-container">
            <div className="landing-container__title">Popular Reviewers</div>
            <div className="landing-container__reviews">
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" onClick={this.openModal} />
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
            </div>
          </div>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Review Modal">
            <div className="landing-container__modal">
              {this.state.modalIsOpen ? (
                <div className="modal-container">
                  <div className="modal__header">
                    <div className="header__title">{this.state.modalInfo.title}</div>
                    <div className="header__reviewer">{this.state.modalInfo.reviewer}</div>
                  </div>
                  <div className="modal__body">
                    <div className="body__image">{this.state.modalInfo.image}</div>
                    <div className="body__stars">{this.state.modalInfo.stars}</div>
                    <div className="body__review">{this.state.modalInfo.review}</div>
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
      </div>
    );
  }
}

export default LandingPage;
