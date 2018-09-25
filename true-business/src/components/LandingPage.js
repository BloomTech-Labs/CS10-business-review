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
    backgroundColor: "rgb(62, 56, 146)",
    overflowY: "scroll",
  },
};

Modal.setAppElement("div");

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
        <div className="landing-container">
          <div className="landing-container__reviews-container">
            <div className="landing-container__title">Popular Reviews</div>
            <div className="landing-container__reviews">
              {this.props.reviews.map((review, i) => {
                if (i < 5) {
                  return (
                    // Need to write a component that shows all the reviews by a certain user
                    // <div key={review._id} onClick={() => this.props.userReviews(user)}>
                    <div key={review._id}>
                      <div className="landing-container__review">
                        <div className="landing-container__item">{review.newMongoId.name}</div>
                        <div className="landing-container__picture" onClick={() => this.openModal(this, review)} />
                        <ul className="landing-container__item--hover">@{review.reviewer.username}</ul>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
          <div className="landing-container__reviews-container">
            <div className="landing-container__title">Popular Businesses</div>
            <div className="landing-container__reviews">
              {this.props.businesses.map((business, i) => {
                if (i < 5) {
                  return (
                    <div key={business._id} onClick={() => this.props.getBusiness(business, true)}>
                      <BusinessThumbnail business={business} key={business._id} />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
          <div className="landing-container__reviews-container">
            <div className="landing-container__title">Popular Reviewers</div>
            <div className="landing-container__reviews">
              {this.props.users.map((user, i) => {
                if (i < 5) {
                  return (
                    // Need to write a component that shows all the userss by a certain user
                    // <div key={users._id} onClick={() => this.props.useruserss(user)}>
                    <div key={user._id}>
                      <div className="landing-container__review">
                        <div className="landing-container__picture" />
                        <ul className="landing-container__item--hover">{user.username}</ul>
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
            <div className="landing-container__modal">
              {this.state.modalIsOpen ? (
                <div className="modal-container">
                  <div className="modal__header">
                    <div className="header__title">{this.state.modalInfo.newMongoId.name}</div>
                    <div className="header__reviewer">@{this.state.modalInfo.reviewer.username}</div>
                  </div>
                  <div className="modal__body">
                    <div className="body__image">Yup</div>
                    <div className="body__stars">
                      {" "}
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
      </div>
    );
  }
}

export default LandingPage;
