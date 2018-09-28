import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import StarRatings from "react-star-ratings";

import NavBar from "./NavBar";

import "../css/SearchResults.css";

class SearchResults extends Component {
  state = {
    currentPage: 0,
  };

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.searchReviews !== this.props.searchReviews) {
      this.updatePage();
    }
  };

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        <div className="search">
          <div className="search__title"> Search Results </div>
          <div className="search__results">
            {this.props.searchResults ? (
              this.props.searchResults.map((result, i) => {
                if (i < this.state.currentPage * 10 + 10 && i >= this.state.currentPage * 10) {
                  return (
                    <div key={result.place_id} className="results__result">
                      <img
                        alt={result.name}
                        className="result__image"
                        src={result.photos}
                        onClick={this.handleBusiness.bind(this, result)}
                      />
                      <div className="result__info">
                        <div className="info__stars-container">
                          <div className="stars-container__text">{result.name}</div>
                          <div className="stars-container__stars">
                            {console.log(result)}
                            <StarRatings
                              starDimension="20px"
                              starSpacing="5px"
                              rating={result.stars}
                              starRatedColor="gold"
                              starEmptyColor="grey"
                              numberOfStars={5}
                              name="rating"
                            />
                            <div className="stars__text">
                              {result.totalReviews ? result.totalReviews + " Reviews" : "0 Reviews"}
                            </div>
                          </div>
                        </div>
                        <div className="info__address">
                          <div className="address__item">
                            {result.formatted_address
                              .split(",")
                              .splice(0, 1)
                              .toString()}
                          </div>
                          <div className="address__item">
                            {result.formatted_address
                              .split(",")
                              .splice(1, 2)
                              .join(",")
                              .trim()}
                          </div>
                          <div className="address__item">
                            {result.formatted_address
                              .split(",")
                              .splice(3)
                              .toString()
                              .trim()}
                          </div>
                        </div>
                        <div className="info__contact">
                          <div className="contact__item">
                            {result.types.map(type => (
                              <div key={type}>{type}</div>
                            ))}
                          </div>
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
          <div id="pagination" className="results__pagination">
            {this.props.searchResults ? this.createPagination() : null}
          </div>
        </div>
      </div>
    );
  }
  handleBusiness = (business, event) => {
    console.log("Mothafuckin business", business);
    this.props.business(business);
  };

  updatePage = (currentPage, event) => {
    // How to update active on click
    if (event) {
      let children = document.getElementById("pagination").childNodes;
      children.forEach(child => {
        child.classList.remove("active");
      });
      document.getElementById(event.target.id).classList.add("active");
      this.setState({ currentPage });
    }
    // Set the 0th page to active
    else {
      document.getElementById(0).classList.add("active");
    }
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
    console.log(pages);
    pages = [...pages].sort((x, y) => x - y);
    if (this.state.currentPage > 3) pages.splice(1, 0, "...");
    if (this.state.currentPage < lastPage - 3) pages.splice(pages.length - 1, 0, "...");
    return pages.map((page, i) => {
      if (page === "...") {
        return (
          <div key={i + page} id={page} className="pagination__page--no-hover">
            {page}
          </div>
        );
      }
      return (
        <div key={page} id={page} className="pagination__page" onClick={this.updatePage.bind(this, page)}>
          {page}
        </div>
      );
    });
  };
}

export default withRouter(SearchResults);
