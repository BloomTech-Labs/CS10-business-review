import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import StarRatings from "react-star-ratings";
import axios from "axios";
import Modal from "react-modal";

import NewReview from "./NewReview";
import NavBar from "./NavBar";

import "../css/Business.css";
import "../css/GeneralStyles.css";

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

class Business extends Component {
  state = {
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
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    if (this.props.business !== null) this.getReviews();
  };

  componentDidUpdate = prevProps => {
    if (prevProps !== this.props) {
      this.setState({ newBusinessId: this.props.newBusinessId });
    }
  };

  componentWillReceiveProps = nextProps => {
    this.setState({ newBusinessId: nextProps.newBusinessId });
  };

  toggleDropDown = event => {
    let toggle = event.target.name;
    let inverse = this.state[toggle];
    this.setState({ [toggle]: !inverse });
  };

  toggleFilterChoice = event => {
    let toggle = event.target.name;
    this.setState({ filterBy: toggle, showfilterBy: false });
  };

  toggleSortChoice = event => {
    let toggle = event.target.name;
    this.setState({ sortBy: toggle, showsortBy: false });
  };

  displayNewReview = () => {
    this.props.landingBusiness
      ? this.setState({ open: true })
      : Promise.resolve()
          .then(() => this.props.createBusiness(this.props.business.place_id))
          .then(response => this.setState({ open: true }))
          .catch(error => console.log("Error creating business", error));
  };

  showModal = show => {
    this.setState({ open: show });
    // Cheap way to re-render with the new review showing
    this.getReviews();
  };

  getReviews = () => {
    if (this.props.business) {
      let id = this.props.landingBusiness ? this.props.business._id : this.props.business.place_id;
      axios
        .get(`http://localhost:3001/api/review/getReviewsByBusinessId/${id}/${this.props.landingBusiness}`)
        .then(reviews => {
          this.setState({ reviews: reviews.data, newBusinessId: this.props.newBusinessId });
        })
        .catch(error => {
          console.log("Error", error);
        });
    }
  };

  openModal = (event, info) => {
    this.setState({ modalIsOpen: true, modalInfo: info });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        {this.props.business ? (
          <div className="business">
            <div className="business__info">
              <div className="info__title">{this.props.business.name}</div>
              <div className="info__street">{this.props.business.formatted_address}</div>
              <div className="info__details">
                <div className="details__hours">
                  <div className="hours__title"> Hours </div>
                  {this.props.business.hasOwnProperty("opening_hours") ? (
                    this.props.business.opening_hours.hasOwnProperty("weekday_text") ? (
                      this.props.business.opening_hours.weekday_text.map(day => {
                        return (
                          <div key={day} className="hours__day">
                            {day}
                          </div>
                        );
                      })
                    ) : (
                      <div>Opening Hours Unlisted</div>
                    )
                  ) : (
                    <div>Opening Hours Unlisted</div>
                  )}
                </div>
                <div className="details__contact">
                  <div className="contact__phone">
                    <div className="phone__number">{this.props.business.formatted_phone_number}</div>
                  </div>
                  <div className="contact__website">
                    {this.props.business.website ? (
                      <a href={this.props.business.website}>
                        {this.props.business.name}
                        's Website
                      </a>
                    ) : (
                      "No Website Listed"
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="business__reviews-container">
              <div className="reviews-container__title">
                Reviews
                {/* I couldn't base this on this.state.open (i.e. I couldn't figure out the proper
                life cycle hook to use to make it work), so while this may be poor practice, for the 
                time being, I'm going with it. */}
                {this.props.business ? (
                  <NewReview
                    newMongoId={this.props.business._id}
                    newGoogleId={this.props.business.place_id}
                    open={this.state.open}
                    showModal={this.showModal}
                  />
                ) : null}
              </div>
              <button id="NewReview" className="reviews-container__button" onClick={this.displayNewReview}>
                New Review
              </button>
              <div className="reviews-container__dropdowns">
                <div className="dropdowns__dropdown">
                  <div className="dropdown__title"> Filter By: </div>
                  <div className="dropdown__drop-container">
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
                  <div className="dropdown__title"> Sort By: </div>
                  <div className="dropdown__drop-container">
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
              </div>
              <div className="reviews-container__reviews">
                {/* onClick should render a modal that shows the review, similar to the landing page */}
                <div className="reviews__review">
                  {this.state.reviews.length ? (
                    this.state.reviews.map(review => {
                      return (
                        <div key={review._id} className="review__info">
                          <div className="review__image" onClick={() => this.openModal(this, review)}>
                            image
                          </div>
                          <StarRatings
                            starDimension="20px"
                            starSpacing="5px"
                            rating={review.stars}
                            starRatedColor="gold"
                            starEmptyColor="grey"
                            numberOfStars={5}
                            name="rating"
                          />
                          <div className="review__reviewer">@{review.reviewer.username}</div>{" "}
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
        ) : (
          <div>{this.props.history.push("/")}</div>
        )}
      </div>
    );
  }
}

export default withRouter(Business);
