import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import StarRatings from "react-star-ratings";
import axios from "axios";

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

  handleError = id => {
    let broken = document.getElementById(id);
    broken.style.opacity = "0";
  };

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        <div className="search">
          <div className="search__title"> Search Results </div>
          {this.props.searchResults ? this.createPagination() : null}
          <div className="search__results">
            {this.props.searchResults ? (
              this.props.searchResults.map((result, i) => {
                if (i < this.state.currentPage * 10 + 10 && i >= this.state.currentPage * 10) {
                  {
                    console.log("RESULT", result);
                  }
                  return (
                    // <div
                    //   key={result.place_id}
                    //   className="results__result"
                    //   onClick={this.handleBusiness.bind(this, result)}>
                    //   <div className="result__image">
                    //     <img
                    //       alt={result.name}
                    //       className={result.photos !== "No Photos Listed" ? "image__landscape" : null}
                    //       src={result.photos !== "No Photos Listed" ? result.photos[0].link : null}
                    //     />
                    //   </div>
                    //   <div className="result__logoNameWeb">
                    //     <div className="logoNameWeb__logo">
                    //       <img
                    //         id={result.place_id}
                    //         onError={this.handleError.bind(this, result.place_id)}
                    //         src={"//logo.clearbit.com/" + result.website}
                    //       />
                    //     </div>
                    //     <div className="logoNameWeb__name">{result.name}</div>
                    //     <StarRatings
                    //       starDimension="20px"
                    //       starSpacing="5px"
                    //       rating={result.stars}
                    //       starRatedColor="gold"
                    //       starEmptyColor="grey"
                    //       numberOfStars={5}
                    //       name="rating"
                    //     />
                    //     <div className="logoNameWeb__web">
                    //       {result.webiste !== "No Website Listed" ? (
                    //         <a href={result.website} target="_blank">
                    //           <i class="fas fa-globe fa-2x" />
                    //         </a>
                    //       ) : null}
                    //     </div>
                    //   </div>
                    //   <div className="result__info">
                    //     <div className="info__address">
                    //       <a href={"https://www.google.com/maps/place/" + result.formatted_address} target="_blank">
                    //         <i style={{ color: "#05386b" }} className="fas fa-map-marked-alt fa-2x" />
                    //       </a>
                    //       <div className="info__city">
                    //         {result.formatted_address
                    //           .split(",")
                    //           .splice(1, 2)
                    //           .join(",")
                    //           .trim()}
                    //       </div>
                    //     </div>
                    //     <div className="info__hours">
                    //       <div className="hours__open"> {result.opening_hours.open_now ? "Open" : "Closed"}</div>{" "}
                    //       {this.props.business.hasOwnProperty("opening_hours") ? (
                    //         this.props.business.opening_hours.hasOwnProperty("weekday_text") ? (
                    //           this.props.business.opening_hours.weekday_text.map(day => {
                    //             return (
                    //               <div key={day} className="hours__day">
                    //                 {day}
                    //               </div>
                    //             );
                    //           })
                    //         ) : (
                    //           <div>Opening Hours Unlisted</div>
                    //         )
                    //       ) : (
                    //         <div>Opening Hours Unlisted</div>
                    //       )}
                    //     </div>
                    //   </div>
                    // </div>
                    <div
                      key={result.place_id}
                      className="results__result"
                      onClick={this.handleBusiness.bind(this, result)}>
                    <img
                      alt={result.name}
                      className={result.photos !== "No Photos Listed" ? "result__landscape" : null}
                      src={result.photos !== "No Photos Listed" ? result.photos[0].link : null}
                    />
                      <div className="result__info">
                    <img
                      id={result.place_id}
                      onError={this.handleError.bind(this, result.place_id)}
                      src={"//logo.clearbit.com/" + result.website}
                    />

                        <div className="info__name">{result.name}</div>
                        <div className="info__address">
                          <a href={"https://www.google.com/maps/place/" + result.formatted_address} target="_blank">
                            <i style={{ color: "#05386b" }} className="fas fa-map-marked-alt fa-2x" />
                          </a>
                          <div>
                    
                            {result.formatted_address
                              .split(",")
                              .splice(1, 2)
                              .join(",")
                              .trim()}
                          </div>
                        </div>
                        <div className="info__type">
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
                        <div className="info__type">
                          {(result.types[0].charAt(0).toUpperCase() + result.types[0].slice(1)).replace(/_/g, " ")}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              })
            ) : (
              <div>No Results</div>
            )}
          </div>
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
    let pages = new Set([0]);
    let lastPage =
      (this.props.searchResults.length / 10) % 1 === 0
        ? Math.floor(this.props.searchResults.length / 10) - 1
        : Math.floor(this.props.searchResults.length / 10);
    for (let i = 10; i < this.props.searchResults.length - 10; i++) {
      if (i % 10 === 0) {
        if (i >= this.state.currentPage * 10 - 20 && i <= this.state.currentPage * 10 + 20) {
          pages.add(i / 10);
        }
        if (this.state.currentPage <= 3 && i <= 40) {
          pages.add(i / 10);
        }
        if (
          this.state.currentPage >= this.props.searchResults.length / 10 - 4 &&
          i >= this.props.searchResults.length - 50
        ) {
          pages.add(i / 10);
        }
      }
    }
    if (this.props.searchResults.length > 10) {
      pages.add(lastPage);
    }
    pages = [...pages].sort((x, y) => x - y);
    if (this.state.currentPage > 3) pages.splice(1, 0, "...");
    if (this.state.currentPage < lastPage - 3) pages.splice(pages.length - 1, 0, "...");
    return (
      <div className="results__pagination">
        Page {this.state.currentPage} / {lastPage}
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
