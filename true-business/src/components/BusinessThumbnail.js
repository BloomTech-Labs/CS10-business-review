import React from "react";
import StarRatings from "react-star-ratings";

import "../css/Thumbnail.css";

const BusinessThumbnail = props => {
  return (
    <div className="thumbnail">
      <img
        alt={props.business.name}
        className="thumbnail__image"
        src={props.business.photos}
        onClick={() => props.getBusiness(props.business, true)}
      />
      <div className="thumbnail__description">
        <div className="description__title"> {props.business.name}</div>
        <StarRatings
          starDimension="20px"
          starSpacing="5px"
          rating={props.business.stars}
          starRatedColor="gold"
          starEmptyColor="grey"
          numberOfStars={5}
          name="rating"
        />
        <div className="description__info">
          {props.business.formatted_address
            .split(",")
            .splice(0, 1)
            .toString()}
        </div>
        <div className="description__info">
          {props.business.formatted_address
            .split(",")
            .splice(1, 2)
            .join(",")
            .trim()}
        </div>
        <div className="description__info">
          {props.business.formatted_address
            .split(",")
            .splice(3)
            .toString()
            .trim()}
        </div>
        <div className="description__info">
          {props.business.types[0].charAt(0).toUpperCase() + props.business.types[0].slice(1)}
        </div>
      </div>
    </div>
  );
};

export default BusinessThumbnail;
