import React from 'react';
import StarRatings from 'react-star-ratings';

import '../css/Thumbnail.css';

const BusinessThumbnail = props => {
  return (
    <div className="thumbnail">
      <img
        alt={props.business.name}
        className="thumbnail__landscape"
        src={props.business.photos[0].link}
        onClick={() => props.getBusiness(props.business, true)}
      />
      <div className="thumbnail__description">
        <div className="description__title"> {props.business.name}</div>
        <div className="description__rating">
          <StarRatings
            style={{ margin: '0 .5rem' }}
            starDimension="20px"
            starSpacing="5px"
            rating={props.business.stars}
            starRatedColor="gold"
            starEmptyColor="grey"
            numberOfStars={5}
            name="rating"
          />
          <div className="rating__count">({props.business.totalReviews})</div>
        </div>
        <div className="description__info">
          <a href={'https://www.google.com/maps/place/' + props.business.formatted_address} target="_blank">
            <div className="description__map">
              <i alt="Click to See Google Map" style={{ color: '#05386b', margin: "0 .5rem" }} className="fas fa-map-marked-alt" />
              {props.business.formatted_address
                .split(',')
                .splice(1, 2)
                .join(',')
                .trim()}
            </div>
          </a>
        </div>
        <div className="description__info">
          {(props.business.types[0].charAt(0).toUpperCase() + props.business.types[0].slice(1)).replace(/_/g, ' ')}
        </div>
      </div>
    </div>
  );
};

export default BusinessThumbnail;

// In case we want this for later (probably not)
//  <div className="description__info">
//   {props.business.formatted_address
//     .split(",")
//     .splice(0, 1)
//     .toString()}
// </div>
  /* <div className="description__info">
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
</div>  */

