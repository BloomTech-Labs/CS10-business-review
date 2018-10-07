import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import StarRatings from "react-star-ratings";
import axios from "axios";
import Modal from "react-modal";
import NewReview from "./NewReview";
import NavBar from "./NavBar";
import { Button, Menu, MenuItem } from "@material-ui/core";

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

class Business extends Component {
  state = {
    anchorElFilter: null,
    anchorElSort: null,
    dropdownOpenFilter: false,
    dropdownOpenSort: false,
    filterBy: "No Filter",
    sortBy: "Date Descending",
    businessID: null,
    newBusinessId: null,
    reviews: [],
    modalIsOpen: false,
    modalInfo: null,
    currentPage: 0,
    total: 0,
  };

  componentDidMount = () => {
    if (this.props.business !== null) {
      this.getReviews(0, this.state.sortBy, this.state.filterBy);
    }
  };

  handleClick = (type, event) => {
    event.preventDefault();
    this.setState({ [type]: event.currentTarget });
  };

  handleClose = type => {
    console.log("handleClose Firing");
    this.setState({ [type]: null });
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
    this.getReviews(this.state.currentPage, this.state.sortBy, this.state.filterBy);
  };

  getReviews = (currentPage, sort, filter) => {
    if (this.props.business) {
      let id = this.props.landingBusiness ? this.props.business._id : this.props.business.place_id;
      axios
        .get(
          `${backend}api/review/getReviewsByBusinessId/${id}/${
            this.props.landingBusiness
          }/${currentPage}/${filter}/${sort}`,
        )
        .then(response => {
          console.log("Axios Response", response);
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
    this.getReviews(currentPage, this.state.sortBy, this.state.filterBy);
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

  sort = sortBy => {
    console.log("Sort Firing", sortBy);
    this.handleClose("anchorElSort");
    this.setState({ sortBy });
    this.getReviews(0, sortBy, this.state.filterBy);
  };

  filter = filterBy => {
    console.log("Filter Firing", filterBy);
    this.handleClose("anchorElFilter");
    this.setState({ filterBy });
    this.getReviews(0, this.state.sortBy, filterBy);
  };

  render() {
    console.log("This.state", this.state);
    return (
      <div>
        <NavBar search={this.props.search} />
        {this.props.business ? (
          <div className="business">
            <div className="business__info">
              <img
                alt={this.props.business.name}
                className="info__landscape"
                src={
                  this.props.business.photos === "No Photos Listed"
                    ? "https://png.icons8.com/ios/50/000000/company.png"
                    : this.props.business.photos[0].link
                }
              />
              <div className="info__title">{this.props.business.name}</div>
              <div className="info__address">
                <div className="address__city">{this.props.business.formatted_address}</div>
                <div className="address__icon">
                  <a
                    href={
                      "https://www.google.com/maps/search/" +
                      this.props.business.formatted_address.replace(/[, ]+/g, "+")
                    }
                    target="_blank">
                    <i style={{ color: "#05386b" }} className="fas fa-map-marked-alt fa-2x" />
                  </a>
                </div>
              </div>
              <div className="info__details">
                <div className="details__title"> Hours </div>
                <div className="details__hours">
                  {this.props.business.hasOwnProperty("opening_hours") ? (
                    this.props.business.opening_hours.hasOwnProperty("weekday_text") ? (
                      this.props.business.opening_hours.weekday_text.map((day, i) => {
                        let dayIndex = 0;
                        let dayNum = new Date().getDay();
                        i + 1 > this.props.business.opening_hours.weekday_text.length
                          ? (dayIndex = i)
                          : (dayIndex = i + 1);
                        let flag = dayIndex === dayNum ? true : false;
                        return (
                          <div style={flag ? { fontWeight: "bolder" } : null} key={day} className="hours__day">
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
                    <i className="fas fa-phone" />
                    <div className="phone__number">
                      {this.props.business.formatted_phone_number
                        ? this.props.business.formatted_phone_number
                        : "No Phone Listed"}
                    </div>
                  </div>
                  <div className="contact__website">
                    {this.props.business.website ? (
                      <div>
                        <i className="fab fa-chrome" />
                        <a className="website__text" href={this.props.business.website}>
                          {this.props.business.name}
                          's Website
                        </a>
                      </div>
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
              {localStorage.getItem("token") && localStorage.getItem("userId") ? (
                <button id="NewReview" className="reviews-container__button" onClick={this.displayNewReview}>
                  New Review
                </button>
              ) : null}
              <div className="reviews-container__dropdowns">
                <div className="dropdowns__dropdown">
                  <div className="dropdown__title"> Filter By: </div>
                  <Button
                    aria-owns={this.state.anchorElFilter ? "filter" : null}
                    aria-haspopup="true"
                    onClick={this.handleClick.bind(this, "anchorElFilter")}>
                    {this.state.filterBy}
                  </Button>
                  <Menu
                    id="filter"
                    style={{ top: "3rem", left: "1rem" }}
                    anchorEl={this.state.anchorElFilter}
                    open={Boolean(this.state.anchorElFilter)}
                    onClose={this.handleClose}>
                    <MenuItem onClick={this.filter.bind(this, "No Filter")}>No Filter</MenuItem>
                    <MenuItem onClick={this.filter.bind(this, "5 Stars or Higher")}>5 Stars or Higher</MenuItem>
                    <MenuItem onClick={this.filter.bind(this, "4 Stars or Higher")}>4 Stars or Higher</MenuItem>
                    <MenuItem onClick={this.filter.bind(this, "3 Stars or Higher")}>3 Stars or Higher</MenuItem>
                    <MenuItem onClick={this.filter.bind(this, "2 Stars or Higher")}>2 Stars or Higher</MenuItem>
                  </Menu>
                </div>
                <div className="dropdowns__dropdown">
                  <div className="dropdown__title"> Sort By: </div>
                  <div className="dropdown__drop-container">
                    <Button
                      aria-owns={this.state.anchorElSort ? "sort" : null}
                      aria-haspopup="true"
                      onClick={this.handleClick.bind(this, "anchorElSort")}>
                      {this.state.sortBy}
                    </Button>
                    <Menu
                      id="sort"
                      style={{ top: "3rem", left: "1rem" }}
                      anchorEl={this.state.anchorElSort}
                      open={Boolean(this.state.anchorElSort)}
                      onClose={this.handleClose}>
                      <MenuItem onClick={this.sort.bind(this, "Date Descending")}>Date Descending</MenuItem>
                      <MenuItem onClick={this.sort.bind(this, "Date Ascending")}>Date Ascending</MenuItem>
                      <MenuItem onClick={this.sort.bind(this, "Rating Ascending")}>Rating Ascending</MenuItem>
                      <MenuItem onClick={this.sort.bind(this, "Rating Descending")}>Rating Descending</MenuItem>
                    </Menu>
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
                            className={
                              review.photos[0].width > review.photos[0].height
                                ? "review__landscape"
                                : "review__portrait"
                            }
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
                          <div className="review__reviewer">@{review.reviewer.username}</div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="reviews--no-results">
                      <div className="no-results__text">No Reviews</div>
                    </div>
                  )}
                </div>
                <div>{this.props.business.totalReviews > 10 ? this.createPagination() : null}</div>
              </div>
            </div>
            <Modal
              shouldCloseOnOverlayClick={false}
              isOpen={this.state.modalIsOpen}
              style={modalStyles}
              contentLabel="Review Modal">
              <div className="modal">
                {this.state.modalIsOpen ? (
                  <div className="modal-container">
                    <div className="modal__header">
                      <div className="header__image">
                        <button className="image__button" onClick={this.closeModal}>
                          Close
                          <i className="far fa-window-close" />
                        </button>
                        {/* Update reviews / user with likes */}
                        <button className="image__button">
                          Like
                          <i className="fas fa-thumbs-up" />
                        </button>
                        <img
                          alt={this.state.modalInfo.newMongoId.name}
                          className={
                            this.state.modalInfo.photos[0].width > this.state.modalInfo.photos[0].height
                              ? "image__landscape"
                              : "image__portrait"
                          }
                          src={this.state.modalInfo.photos[0].link}
                        />
                      </div>
                      <div className="header__user">
                        {/* Onclick to go to the user component whenever we get to that... */}
                        <div className="header__reviewer">
                          <div className="reviewer__info--onclick">@{this.state.modalInfo.reviewer.username}</div>
                          <div className="reviewer__info">{this.state.modalInfo.reviewer.numberOfReviews} Reviews</div>
                          <div className="reviewer__info">{this.state.modalInfo.reviewer.numberOfLikes} Likes</div>
                        </div>
                      </div>
                    </div>
                    <div className="modal__body">
                      <div className="body__stars">
                        <div className="stars__title"> {this.state.modalInfo.newMongoId.name}</div>
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
