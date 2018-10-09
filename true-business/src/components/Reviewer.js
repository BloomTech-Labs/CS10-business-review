import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import NavBar from "./NavBar.js";
import axios from "axios";
import StarRatings from "react-star-ratings";
import Modal from "react-modal";
import { Button, Menu, MenuItem } from "@material-ui/core";

import "../css/Reviewer.css";

let backend = process.env.REACT_APP_LOCAL_BACKEND;
let heroku = "https://cryptic-brook-22003.herokuapp.com/";
if (typeof backend !== "string") {
  backend = heroku;
}

let modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "90vh",
    width: "60vw",
    zIndex: "5",
    backgroundColor: "rgb(238,238,238)",
    color: "rgb(5,56,107)",
    overflow: "hidden",
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
    likeErrorMessage: "",
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    this.setState({ reviewer: this.props.reviewer, reviews: this.props.reviews });
  };

  openModal = (event, info) => {
    this.setState({ modalIsOpen: true, modalInfo: info });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false, liked: false, unliked: false, likeError: false, likeErrorMessage: "" });
  };

  updateLikes = (info, bool, event) => {
    let reviewerId = info.reviewer._id;
    let reviewId = info._id;
    let userId = localStorage.getItem("userId");
    if (localStorage.getItem("token") && userId) {
      axios
        .put(`${backend}api/reviews/updateLikes`, { reviewerId, reviewId, userId, bool })
        .then(() => {
          bool
            ? this.setState({ liked: true, likeError: false, likeErrorMessage: "" })
            : this.setState({ unliked: true, likeError: false, likeErrorMessage: "" });
        })
        .catch(err => {
          this.setState({ likeError: true, likeErrorMessage: err.response.data.errorMessage });
        });
    } else {
      this.setState({ likeError: true, likeErrorMessage: "Sign In to Like/Dislike" });
    }
  };

  handleClick = (type, event) => {
    event.preventDefault();
    this.setState({ [type]: event.currentTarget });
  };

  handleClose = type => {
    this.setState({ [type]: null });
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
                    ? "profile__landscape"
                    : "profile__portrait"
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
                {console.log("REVIEWER", this.state.reviewer)}
                <div className="info__details">
                  Member Since:
                  <div className="details__text">{this.state.reviewer.accountActivated.replace(/[^\d{4}-\d{2}-\d{2}].*/, "")}</div>
                </div>
              </div>
            </div>
            <div className="reviewer__reviews">
              {/* onClick should render a modal that shows the review, similar to the landing page */}
              <div className="reviews__review">
                {this.state.reviews.length ? (
                  this.state.reviews.map(review => {
                    return (
                      <div key={review._id} className="review__info" onClick={() => this.openModal(this, review)}>
                        <div className="info__header">
                          <div className="header__data">
                            <div className="data__text">{review.title ? review.title : "No Title"}</div>
                            <div className="data__text">
                              <span style={{ marginRight: "1rem" }}>
                                <StarRatings
                                  starDimension="20px"
                                  starSpacing="5px"
                                  rating={review.stars}
                                  starRatedColor="gold"
                                  starEmptyColor="grey"
                                  numberOfStars={5}
                                  name="rating"
                                />
                              </span>
                              {review.createdOn.replace(/[^\d{4}-\d{2}-\d{2}].*/, "")}
                            </div>
                          </div>
                          <img
                            alt={review.reviewer.username}
                            className={
                              review.photos[0].width > review.photos[0].height
                                ? "review__landscape"
                                : "review__portrait"
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
                                  ? "review__landscape"
                                  : "review__portrait"
                              }
                              src={review.reviewer.userImages[0].link}
                              onClick={() => this.openModal(this, review)}
                            />
                            <div className="reviewer__text">{review.reviewer.username}</div>
                          </div>
                          <div className="body__review">{review.body ? review.body : "No Review"}</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="reviews--no-results">
                    <div className="no-results__text">No Reviews</div>
                  </div>
                )}
                <div>{this.state.total > 12 ? this.createPagination() : null}</div>
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
                                  <i style={{ marginRight: ".5rem" }} className="fas fa-thumbs-up" />
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
                                  <i style={{ marginRight: ".5rem" }} className="fas fa-thumbs-down" />
                                  <i className="fas fa-check" />
                                </div>
                              ) : (
                                <i className="fas fa-thumbs-down" />
                              )}
                            </button>
                          ) : null}
                          {this.state.likeError ? (
                            <div style={{ color: "red", fontSize: ".8rem" }}>{this.state.likeErrorMessage}</div>
                          ) : null}
                        </div>
                        <a href={this.state.modalInfo.photos[0].link} target="_blank">
                          <img
                            alt={this.state.modalInfo.reviewer.name}
                            className={
                              this.state.modalInfo.photos[0].width > this.state.modalInfo.photos[0].height
                                ? "image__landscape"
                                : "image__portrait"
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
                        <div>{this.state.modalInfo.createdOn.replace(/[^\d{4}-\d{2}-\d{2}].*/, "")}</div>
                        <div>
                          <i style={{ paddingRight: ".5rem" }} className="fas fa-user" />
                          {this.state.modalInfo.reviewer.username}
                        </div>
                      </div>
                      <div className="body__title">
                        {this.state.modalInfo.title ? this.state.modalInfo.title : "***Untitled***"}
                      </div>
                      <div className="body__review">
                        {this.state.modalInfo.body ? this.state.modalInfo.body : "***No Body***"}
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
