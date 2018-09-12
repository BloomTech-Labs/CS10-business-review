import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import NavBar from './NavBar';

import '../css/SearchResults.css';

class SearchResults extends Component {
  componentDidMount = () => {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        <div className="search-container">
          <div className="search-container__title"> Search Results </div>
          <div className="search-container__results">
            {this.props.searchResults ? (
              this.props.searchResults.map((result, i) => {
                return (
                  <div key={i} className="results__result" onClick={this.handleBusiness.bind(this, result)}>
                    <div id="picture1" className="result__picture" onClick={this.openModal} />
                    <ul className="result__item">Stars</ul>
                    <ul className="result__item">{result.name}</ul>
                    <ul className="result__item">{result.location}</ul>
                    <ul className="result__item">Restaurant Type</ul>
                  </div>
                );
              })
            ) : (
              <div className="search-results__result">'No Results Found'</div>
            )}
          </div>
        </div>
      </div>
    );
  }
  handleBusiness = (business, event) => {
    this.props.business(business);
    this.props.history.push(`/business`);
  }
}

export default withRouter(SearchResults);