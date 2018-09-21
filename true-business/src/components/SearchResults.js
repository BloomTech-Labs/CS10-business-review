import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import NavBar from './NavBar';

import '../css/SearchResults.css';

class SearchResults extends Component {
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
                  <div key={i} className="results__result">
                    <div
                      id="picture1"
                      src={result}
                      className="result__picture"
                      onClick={this.handleBusiness.bind(this, result)}
                    />
                    <ul className="result__item">{result.name}</ul>
                    <ul className="result__item">{result.formatted_address}</ul>
                    <ul className="result__item">{result.location}</ul>
                    <ul className="result__item">
                      {result.types.map((type,i) => (
                        <span key={i}>{type.replace(/_/g, ' ') + ', '}</span>
                      ))}
                    </ul>
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
  };
}

export default withRouter(SearchResults);
