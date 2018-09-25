import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import StarRatings from "react-star-ratings";

import NewReview from "./NewReview";
import NavBar from "./NavBar";

import "../css/Business.css";
import "../css/GeneralStyles.css";

class Business extends Component {
  state = {
    dropdownOpenFilter: false,
    dropdownOpenSort: false,
    filterBy: "No Filter",
    showfilterBy: false,
    sortBy: "Date Descending",
    showsortBy: false,
    businessID: null,
    newBusinessID: null,
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  // Not entirely sure if both of these are necessary.
  // Or either for that matter... I just didn't want to break it
  // and haven't tested it with one / the other / neither yet.
  componentDidUpdate = prevProps => {
    if (prevProps !== this.props) {
      this.setState({ newBusinessID: this.props.newBusinessID });
    }
  };

  componentWillReceiveProps = nextProps => {
    this.setState({ newBusinessID: nextProps.newBusinessID });
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

  // this is now a promise, in hopes that it will wait to open the modal after the business is created, but
  // so far no bueno.
  displayNewReview = () => {
    this.props.landingBusiness
      ? this.setState({ open: true })
      : Promise.resolve()
          .then(() => this.props.createBusiness(this.props.business.place_id))
          .then(() => this.setState({ open: true }))
          .catch(error => console.log("Error creating business", error));
  };

  showModal = show => {
    this.setState({ open: show });
  };

  render() {
    console.log("props in business", this.props.business)
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
                  {/* DB records have hours, google API returns opening_hours */}
                  {(this.props.business.hasOwnProperty("hours") ? (
                    this.props.business.hours
                  ) : (
                    this.props.business.opening_hours
                  )) ? (
                    // If the hours exist, render them, otherwise return "No Hours Listed"
                    (this.props.business.hours || this.props.business.opening_hours.weekday_text).map((day, i) => {
                      return (
                        <div className="hours__day" key={i}>
                          {day}
                        </div>
                      );
                    })
                  ) : (
                    <div>No Hours Listed</div>
                  )}
                </div>
                <div className="details__contact">
                  <div className="contact__phone">
                    {/* DB records have phone, google API returns formatted phone_number */}
                    {(this.props.business.hasOwnProperty("phone") ? (
                      this.props.business.phone
                    ) : (
                      this.props.business.formatted_phone_number
                    )) ? (
                      // If the hours exist, render them, otherwise return "No Hours Listed"
                      <div className="phone__number">
                        {this.props.business.phone || this.props.business.formatted_phone_number}
                      </div>
                    ) : (
                      <div className="phone__number">No Phone Listed</div>
                    )}
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
                    newBusinessId={this.props.business._id ? this.props.business._id : this.props.newBusinessId}
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
                  <div className="review__image">image</div>
                  <StarRatings
                    starDimension="20px"
                    starSpacing="5px"
                    rating={this.props.business.stars}
                    starRatedColor="gold"
                    starEmptyColor="grey"
                    numberOfStars={5}
                    name="rating"
                  />
                  <div className="review__reviewer">@person</div>
                </div>
                <div className="reviews__review">
                  <div className="review__image">image</div>
                  <StarRatings
                    starDimension="20px"
                    starSpacing="5px"
                    // Change these to review ratings
                    rating={this.props.business.stars}
                    starRatedColor="gold"
                    starEmptyColor="grey"
                    numberOfStars={5}
                    name="rating"
                  />
                  <div className="review__reviewer">@person</div>
                </div>
                <div className="reviews__review">
                  <div className="review__image">image</div>
                  <StarRatings
                    starDimension="20px"
                    starSpacing="5px"
                    rating={this.props.business.stars}
                    starRatedColor="gold"
                    starEmptyColor="grey"
                    numberOfStars={5}
                    name="rating"
                  />
                  <div className="review__reviewer">@person</div>
                </div>
                <div className="reviews__review">
                  <div className="review__image">image</div>
                  <StarRatings
                    starDimension="20px"
                    starSpacing="5px"
                    rating={this.props.business.stars}
                    starRatedColor="gold"
                    starEmptyColor="grey"
                    numberOfStars={5}
                    name="rating"
                  />
                  <div className="review__reviewer">@person</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>{this.props.history.push("/")}</div>
        )}
      </div>
    );
  }
}

export default withRouter(Business);