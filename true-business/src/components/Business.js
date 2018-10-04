import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import StarRatings from "react-star-ratings";
import axios from "axios";
import Modal from "react-modal";
import NewReview from "./NewReview";
import NavBar from "./NavBar";

import "../css/Business.css";
import "../css/GeneralStyles.css";

let backend = process.env.REACT_APP_LOCAL_BACKEND;
let heroku = "https://cryptic-brook-22003.herokuapp.com/";
if (typeof backend !== "string") {
  backend = heroku;
}

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
    currentPage: 0,
    total: 0,
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    if (this.props.business !== null) {
      this.getReviews(0);
    }
  };

  toggleDropDown = event => {
    let toggle = event.target.name;
    let other = "showfilterBy";
    if (toggle === "showfilterBy") {
      other = "showsortBy";
    }
    let inverse = this.state[toggle];
    this.setState({ [toggle]: !inverse, [other]: false });
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
    this.getReviews(this.state.currentPage);
  };

  getReviews = currentPage => {
    if (this.props.business) {
      let id = this.props.landingBusiness ? this.props.business._id : this.props.business.place_id;
      axios
        .get(`${backend}api/review/getReviewsByBusinessId/${id}/${this.props.landingBusiness}/${currentPage}`)
        .then(response => {
          this.setState({
            reviews: response.data.reviews,
            total: response.data.total,
            newBusinessId: this.props.newBusinessId,
          });
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

  updatePage = currentPage => {
    this.setState({ currentPage });
    this.getReviews(currentPage);
  };

  createPagination = () => {
    let lastPage =
      // Ex. 100 / 10 % 1 = 0
      // Ex. 101 / 10 % 1 != 0
      (this.state.total / 10) % 1 === 0
        ? // 100 / 10 - 1 = 9, so pages 0-9 will show results 0-99 (10 pages, 10 each page)
          Math.floor(this.state.total / 10) - 1
        : // 101 / 10 = 10, so pages 0-10 will show results 0-100 (11 pages, 1 on the last page)
          Math.floor(this.state.total / 10);

    // Set is the lazy / quick way if there is only one page
    let pages = new Set([0, lastPage]);
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
      pages.splice(1, 0, "...");
    }

    // Add an elipsis if more than 3 away from the last page
    if (this.state.currentPage < lastPage - 2) {
      pages.splice(pages.length - 1, 0, "...");
    }

    return pages.length > 1 ? (
      <div className="reviews__pagination">
        Page {this.state.currentPage + 1} / {lastPage + 1}
        <div id="pagination" className="pagination__pages">
          {pages.map((page, i) => {
            if (page === "...") {
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

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        {this.props.business ? (
          <div className="business">
            <div className="business__info">
              <img
                alt={this.props.business.name}
                className="info__landscape"
                src={this.props.business.photos[0].link}
              />
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
                          <img
                            alt={review.reviewer.username}
                            className="review__landscape"
                            src={review.photos[0].link}
                            onClick={() => this.openModal(this, review)}
                          />
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
                <div>{this.createPagination()}</div>
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
                      <img
                        alt={this.state.modalInfo.name}
                        className="body__landscape"
                        src={this.state.modalInfo.photos[0].link}
                        onClick={this.openModal}
                      />
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
