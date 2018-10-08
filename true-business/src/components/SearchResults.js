import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import StarRatings from "react-star-ratings";

import NavBar from "./NavBar";

import "../css/SearchResults.css";

let backend = process.env.REACT_APP_LOCAL_BACKEND;
let heroku = "https://cryptic-brook-22003.herokuapp.com/";
if (typeof backend !== "string") {
  backend = heroku;
}

class SearchResults extends Component {
  state = {
    currentPage: 0,
    lastPage: 0,
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  // Reset the currentPage to 0 if a new search is made
  componentDidUpdate = prevProps => {
    if (this.props.searchResults && this.props.searchResults !== prevProps.searchResults) {
      this.setState({ currentPage: 0 });
    }
  };

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        <div className={this.props.searchResults ? "search" : "search--no-results"}>
          <div className="search__title"> Search Results </div>
          {this.props.searchResults > 10 ? this.createPagination() : null}
          {this.props.searchResults ? (
            <div className="search__results">
              {this.props.searchResults.map((result, i) => {
                if (i < this.state.currentPage * 10 + 10 && i >= this.state.currentPage * 10) {
                  return (
                    <div
                      key={result.place_id}
                      className="results__result"
                      onClick={this.handleBusiness.bind(this, result)}>
                      <img
                        alt={result.name}
                        className="result__image"
                        src={
                          result.photos !== "No Photos Listed"
                            ? result.photos[0].link
                            : "https://png.icons8.com/ios/50/000000/company.png"
                        }
                      />
                      <div className="result__info">
                        <div className="info__name">
                          <div className="name__title">{result.name}</div>
                          <div className="name__rating">
                            <StarRatings
                              starDimension="20px"
                              starSpacing="5px"
                              rating={result.stars}
                              starRatedColor="gold"
                              starEmptyColor="grey"
                              numberOfStars={5}
                              name="rating"
                            />
                          </div>
                        </div>
                        <a
                          href={"https://www.google.com/maps/search/" + result.formatted_address.replace(/[, ]+/g, "+")}
                          target="_blank"
                          onClick={this.mapOnly}
                          className="info__address">
                          <i
                            style={{ paddingRight: "1rem", color: "#05386b" }}
                            className="fas fa-map-marked-alt fa-2x"
                          />
                          <div className="address__text">
                            <div className="text__info">
                              {result.formatted_address
                                .split(",")
                                .splice(0, 1)
                                .toString()}
                            </div>
                            <div className="text__info">
                              {result.formatted_address
                                .split(",")
                                .splice(1, 2)
                                .join(",")
                                .trim()}
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          ) : (
            <div className="search__no-results">
              <i className="far fa-angry fa-10x" />
              <div className="no-results__text">No Results Found</div>
            </div>
          )}
          {this.props.searchResults ? (this.props.searchResults.length > 10 ? this.createPagination() : null) : null}
        </div>
      </div>
    );
  }

  handleBusiness = (business, event) => {
    this.props.business(business);
  };

  mapOnly = event => {
    event.stopPropagation();
  };

  updatePage = currentPage => {
    this.setState({ currentPage });
  };

  createPagination = () => {
    let lastPage = this.props.searchResults.length > 10 ? 1 : 0;
    let pages = new Set([0, lastPage]);
    pages = [...pages].sort((x, y) => x - y);
    return (
      <div className="results__pagination">
        {this.state.currentPage} / {lastPage}
        <div id="pagination" className="pagination__pages">
          {pages.map((page, i) => {
            return (
              <button key={page} id={page} className="pagination__page" onClick={this.updatePage.bind(this, page)}>
                {page}
              </button>
            );
          })}
        </div>
      </div>
    );
  };
}

export default withRouter(SearchResults);
