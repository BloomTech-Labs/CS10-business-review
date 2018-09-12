import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { withRouter } from 'react-router-dom';

import NavBar from './NavBar';

import '../css/Business.css';

class Business extends Component {
  state = {
    dropdownOpenFilter: false,
    dropdownOpenSort: false,
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  toggle = event => {
    this.setState({ [event.target.name]: !event.target.name });
  };

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        {this.props.business ? (
          <div className="business">
            <div className="business__title">Business Type - {this.props.business.name}</div>
            <div className="business__street">{this.props.business.location}</div>
            <div className="business__city">{this.props.business.location}</div>
            <div className="business__info">
              <div className="info__hours">
                <div className="hours__title"> Hours </div>
                <div className="hours__day">Monday: 8am - 8pm</div>
                <div className="hours__day">Tuesday: 8am - 8pm</div>
                <div className="hours__day">Wednesday: 8am - 8pm</div>
                <div className="hours__day">Thursday: 8am - 8pm</div>
                <div className="hours__day">Friday: 8am - 8pm</div>
                <div className="hours__day">Saturday: 8am - 8pm</div>
                <div className="hours__day">Sunday: 8am - 8pm</div>
              </div>
              <div className="info__description">Awesome taco place</div>
              <div className="info__contact">
                <div className="contact__phone">(865) 867-5309</div>
                <div className="contact__website">
                  {this.props.business.website ? this.props.business.website : 'No Website Listed'}
                </div>
              </div>
            </div>
            <div className="business__reviews-container">
              <div className="reviews-container__title">Reviews</div>
              <div className="reviews-container__dropdowns">
                <div className="dropdowns__dropdown"> Filter By: </div>
                <div className="dropdowns__dropdown"> Sort By: </div>
              </div>
              <div className="reviews-container__reviews">
                {/* onClick should render a modal that shows the review, similar to the landing page */}
                <div className="reviews__review">
                  <div className="review__image">image</div>
                  <div className="review__stars">stars</div>
                  <div className="review__reviewer">@person</div>
                </div>
                <div className="reviews__review">
                  <div className="review__image">image</div>
                  <div className="review__stars">stars</div>
                  <div className="review__reviewer">@person</div>
                </div>
                <div className="reviews__review">
                  <div className="review__image">image</div>
                  <div className="review__stars">stars</div>
                  <div className="review__reviewer">@person</div>
                </div>
                <div className="reviews__review">
                  <div className="review__image">image</div>
                  <div className="review__stars">stars</div>
                  <div className="review__reviewer">@person</div>
                </div>
              </div>
            </div>{' '}
          </div>
        ) : (
          <div>{this.props.history.push('/')}</div>
        )}
      </div>
    );
  }
}

export default withRouter(Business);
