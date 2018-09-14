import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import NavBar from './NavBar.js';

import '../css/User.css';

class User extends Component {
  state = {
    breadcrumbs: ['Home', 'My Reviews'],
    userReviews: [
      {
        business: 'Taco Bell',
        businessType: '"Tacos" *cough*',
        businessstreet: '123 West',
        businessCity: 'Knoxville, TN 37919',
        updated: '1/1/1',
      },
      {
        business: 'Taco Bell',
        businessType: '"Tacos" *cough*',
        businessstreet: '123 West',
        businessCity: 'Knoxville, TN 37919',
        updated: '1/1/1',
      },
      {
        business: 'Taco Bell',
        businessType: '"Tacos" *cough*',
        businessstreet: '123 West',
        businessCity: 'Knoxville, TN 37919',
        updated: '1/1/1',
      },
      {
        business: 'Taco Bell',
        businessType: '"Tacos" *cough*',
        businessstreet: '123 West',
        businessCity: 'Knoxville, TN 37919',
        updated: '1/1/1',
      },
    ],
    current: 'Add',
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        <div className="user">
          <div className="user__header">
            <div className="header__breadcrumbs">
              {this.state.breadcrumbs.map((crumb, i) => {
                if (i + 1 === this.state.breadcrumbs.length) {
                  return (
                    <div key={crumb} className="breadcrumbs__breadcrumb">
                      {crumb}
                    </div>
                  );
                }
                return (
                  <div key={crumb} className="breadcrumbs__breadcrumb">
                    {crumb} <i className="fas fa-arrow-right" />
                  </div>
                );
              })}
            </div>
            {/* Eventually have this actually sign out the person obviously... */}
            <div className="header__signout" onClick={() => this.props.history.push('/')}>
              Sign Out
            </div>
          </div>
          <div className="user__body">
            <div className="body__left-bar">
              <button className="left-bar__button" name="Add a Review" onClick={this.updateCurrent}>
                Add a Review
              </button>
              <button className="left-bar__button" name="My Reviews" onClick={this.updateCurrent}>
                My Reviews
              </button>
              <button className="left-bar__button" name="Billing" onClick={this.updateCurrent}>
                Billing
              </button>
              <button className="left-bar__button" name="Settings" onClick={this.updateCurrent}>
                Settings
              </button>
            </div>
            <div className="body__content">{this.loadContent()}</div>
          </div>
        </div>
      </div>
    );
  }
  updateCurrent = event => {
    this.setState({ current: event.target.name });
  };
  loadContent = () => {
    switch (this.state.current) {
      case 'My Reviews':
        return (
          <div className="content__user-reviews">
            {this.state.userReviews.map((review, i) => {
              return (
                /* Cheap workaround until we have review ids / hook up to the back end */
                <div key={i} className="user-reviews__item">
                  <div className="item__image">image</div>
                  <div className="item__info">{review.business}</div>
                  <div className="item__info">{review.businessType}</div>
                  <div className="item__info">{review.street}</div>
                  <div className="item__info">{review.city}</div>
                  <div className="item__info">Last Updated: {review.updated}</div>
                </div>
              );
            })}
            <div className="user-reviews__add">
              <div className="add__image">
                <i className="fas fa-plus-square fa-5x" />
              </div>
              <div className="add__text">Add a review</div>
            </div>
          </div>
        );
      case 'Billing':
        return <div className="content__billing">No idea what will go here, I guess something for Stripe?</div>;
      case 'Settings':
        return <div className="content__settings">Also no idea for this. Just following the wireframe...</div>;
      default:
        return (
          <div className="content__solo-add">
            <div className="solo-add__image">
              <i className="fas fa-plus-square fa-7x" />
            </div>
            <div className="solo-add__text">Add a review</div>
          </div>
        );
    }
  };
}

export default withRouter(User);
