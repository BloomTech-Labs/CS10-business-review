import React, { Component } from "react";
import Modal from "react-modal";
import BusinessThumbnail from "./BusinessThumbnail";
import StarRatings from "react-star-ratings";

import "../css/LandingPage.css";
import "../css/GeneralStyles.css";

import NavBar from "./NavBar";

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
    overflowY: "scroll",
  },
};

Modal.setAppElement("div");

class LandingPage extends Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      modalInfo: null
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal(event, info) {
    this.setState({ modalIsOpen: true, modalInfo: info });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        <div className="landing">
          <div className="landing__container">
            <div className="container__header">Popular Reviews</div>
            <div className="container__items">
              {this.props.reviews.map((review, i) => {
                if (i < 4) {
                  return (
                    // Need to write a component that shows all the reviews by a certain user
                    // Whenever they click on the username in this section or in the bottom section
                    // <div key={review._id} onClick={() => this.props.userReviews(user)}>
                    <div key={review._id} className="items__item">
                      <img
                        alt={review.newMongoId.name}
                        src={review.photos}
                        className="item__image"
                        onClick={() => this.openModal(this, review)}
                      />
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
                      <div className="item__info--hover">@{review.reviewer.username}</div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
          <div className="landing__container">
            <div className="container__header">Popular Businesses</div>
            <div className="container__items">
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
            <div className="container__items">
              {this.props.users.map((user, i) => {
                if (i < 4) {
                  return (
                    // Need to write a component that shows all the reviews by a certain user
                    // Whenever they click on the username in this section or in the bottom section
                    // <div key={review._id} onClick={() => this.props.userReviews(user)}>
                    <div key={user._id} className="items__item">
                      <img alt={user.username} src={user.photos} className="item__image" />
                      <div className="item__info--hover">@{user.username}</div>
                      <div className="item__info"># of Reviews: {user.numberOfReviews}</div>
                      <div className="item__info"># of Likes: {user.numberOfLikes}</div>
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
            contentLabel="Review Modal"
          >
            <div className="landing-container__modal">
              {this.state.modalIsOpen ? (
                <div className="modal-container">
                  <div className="modal__header">
                    <div className="header__title">
                      {this.state.modalInfo.newMongoId.name}
                    </div>
                    <div className="header__reviewer">
                      @{this.state.modalInfo.reviewer.username}
                    </div>
                  </div>
                  <div className="modal__body">
                    <img
                      alt={this.state.modalInfo.newMongoId.name}
                      className="body__image"
                      src={this.state.modalInfo.photos}
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
                    <div className="body__review">
                      {this.state.modalInfo.body}
                    </div>
                  </div>
                  <div className="modal__footer">
                    <button
                      className="footer__button"
                      onClick={this.closeModal}
                    >
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
