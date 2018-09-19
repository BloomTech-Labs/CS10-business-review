import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container,   Card, CardBody,  CardText, CardImg } from 'reactstrap';

import NavBar from './NavBar';

import '../css/Business.css';
import '../css/GeneralStyles.css';

class Business extends Component {
  state = {
    dropdownOpenFilter: false,
    dropdownOpenSort: false,
    filterBy: 'No Filter',
    showfilterBy: false,
    sortBy: 'Date Descending',
    showsortBy: false,
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
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

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
<div className="business">
          <Container>
          {
        this.props.business.map((business) => {                            
            if(this.props.match.params._id === business._id.toString()) {                           
            return ( <div key={business._id}>                                
              <Card className ="business-thumbnail">
                <CardBody>
                  <CardImg className="business-title heading"
                     src={business.image}
                     />                                         
                     <CardText>Business name: {business.name}</CardText>
                     <CardText>Stars: {business.stars}</CardText>
                     {/* <CardText>{business.location}</CardText> */}
                     <CardText>Business type: {business.type}</CardText>                              
                     </CardBody>
                     </Card>
                     <button className="Review-button" >Review</button>                                
                      </div>)
                      }                                
                    })} 
            </Container>

        </div>
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
            </div>
          </div>
        ) : (
          <div>{this.props.history.push('/')}</div>
        )}

      </div>
    );
  }
}

export default withRouter(Business);
