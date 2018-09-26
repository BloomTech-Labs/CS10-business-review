import React from 'react';
import StarRatings from 'react-star-ratings';

import '../css/BusinessThumbnail.css';

const BusinessThumbnail = props => {
  return (
    <div className="thumbnail">
      <img className="thumbnail__image" alt={props.business.name + ' image'} />
      <div className="thumbnail__text"> {props.business.name}</div>
      <div className="thumbnail__text">
        <StarRatings
          starDimension="20px"
          starSpacing="5px"
          rating={props.business.stars}
          starRatedColor="gold"
          starEmptyColor="grey"
          numberOfStars={5}
          name="rating"
        />
      </div>
      <div className="thumbnail__text">{props.business.formatted_address}</div>
      <div className="thumbnail__text">{props.business.types[0].charAt(0).toUpperCase() + props.business.types[0].slice(1)}</div>
    </div>
  );
};

export default BusinessThumbnail;
