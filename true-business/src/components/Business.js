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
let heroku = 'https://cryptic-brook-22003.herokuapp.com/';
if (typeof(backend) !== 'string') {
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
    currentPage: 0,
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
    if (this.props.business !== null) this.getReviews();
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.reviews.length !== this.state.reviews.length) {
      this.updatePage();
    }
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
        .get(`${backend}api/review/getReviewsByBusinessId/${id}/${this.props.landingBusiness}`)
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

  updatePage = (currentPage, event) => {
    // How to update active on click
    if (event) {
      let children = document.getElementById("pagination").childNodes;
      children.forEach(child => {
        child.classList.remove("active");
      });
      document.getElementById(event.target.id).classList.add("active");
      this.setState({ currentPage });
    }
    // Set the 0th page to active
    else {
      document.getElementById(0).classList.add("active");
    }
  };

  createPagination = () => {
    let pages = new Set([0]);
    let lastPage =
      (this.state.reviews.length / 10) % 1 === 0
        ? Math.floor(this.state.reviews.length / 10) - 1
        : Math.floor(this.state.reviews.length / 10);
    for (let i = 10; i < this.state.reviews.length - 10; i++) {
      if (i % 10 === 0) {
        if (i >= this.state.currentPage * 10 - 20 && i <= this.state.currentPage * 10 + 20) {
          pages.add(i / 10);
        }
        if (this.state.currentPage <= 3 && i <= 40) {
          pages.add(i / 10);
        }
        if (this.state.currentPage >= this.state.reviews.length / 10 - 4 && i >= this.state.reviews.length - 50) {
          pages.add(i / 10);
        }
      }
    }
    if (this.state.reviews.length > 10) {
      pages.add(lastPage);
    }
    pages = [...pages].sort((x, y) => x - y);
    if (this.state.currentPage > 3) pages.splice(1, 0, "...");
    if (this.state.currentPage < lastPage - 3) pages.splice(pages.length - 1, 0, "...");
    return pages.map((page, i) => {
      if (page === "...") {
        return (
          <div key={i + page} id={page} className="pagination__page--no-hover">
            {page}
          </div>
        );
      }
      return (
        <div key={page} id={page} className="pagination__page" onClick={this.updatePage.bind(this, page)}>
          {page}
        </div>
      );
    });
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
                className={this.props.business.photos[0].width >= this.props.business.photos[0].height ? "info__landscape" : "info__portrait"}
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
              {
               localStorage.getItem('token') &&  localStorage.getItem('userId') ? (
              <button id="NewReview" className="reviews-container__button" onClick={this.displayNewReview}> New Review </button>
               ) : (null)}
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
                    this.state.reviews.map((review, i) => {
                      if (i < this.state.currentPage * 10 + 10 && i >= this.state.currentPage * 10) {
                        console.log("FUCKING REVIEW", review)
                        return (
                          <div key={review._id} className="review__info">
                            <img
                              alt={review.reviewer.username}
                              className={review.photos[0].width >= review.photos[0].height ? "review__landscape" : "review__portrait"}
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
                      } else {
                        return null;
                      }
                    })
                  ) : (
                    <div>No Reviews</div>
                  )}
                </div>
                <div id="pagination" className="reviews__pagination">
                  {this.createPagination()}
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
                    <img
                alt={this.state.modalInfo.name}
                className={this.state.modalInfo.photos[0].width >= this.state.modalInfo.photos[0].height ? "body__landscape" : "body__portrait"}
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
