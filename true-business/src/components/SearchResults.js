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

  // Error Handler if there isn't a logo on clearbit
  handleError = id => {
    let broken = document.getElementById(id);
    broken.src = "https://png.icons8.com/ios/50/000000/cancel.png";
    broken.style.color = "#05386b";
    let text = document.createTextNode("No Logo");
    let div = document.createElement("div");
    div.classList.add("no-logo");
    div.appendChild(text);
    broken.parentNode.appendChild(div);
  };

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        <div className={this.props.searchResults ? "search" : "search--no-results"}>
          <div className="search__title"> Search Results </div>
          {this.props.searchResults ? this.createPagination() : null}
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
                        <div className="info__address">
                          <div className="address__city">{result.formatted_address}</div>
                          <div className="address__icon">
                            <a
                              href={
                                "https://www.google.com/maps/search/" + result.formatted_address.replace(/[, ]+/g, "+")
                              }
                              target="_blank">
                              <i style={{ color: "#05386b" }} className="fas fa-map-marked-alt fa-2x" />
                            </a>
                          </div>
                        </div>
                        <div className="info__type">
                          {(result.types[0].charAt(0).toUpperCase() + result.types[0].slice(1)).replace(/_/g, " ")}
                        </div>
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
          {this.props.searchResults ? this.createPagination() : null}
        </div>
      </div>
    );
  }

  handleBusiness = (business, event) => {
    this.props.business(business);
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
        Page {this.state.currentPage} / {lastPage}
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
