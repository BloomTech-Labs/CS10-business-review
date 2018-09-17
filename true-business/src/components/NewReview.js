import React, { Component } from 'react';
import Modal from 'react-modal';
import StarRatings from 'react-star-ratings';
// We'll need this eventually
// import axios from 'axios';

import '../css/NewReview.css';

let modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '90%',
    width: '75%',
    zIndex: '5',
    backgroundColor: 'darkslategrey',
    overflow: 'hidden',
  },
};

Modal.setAppElement('div');

export default class NewReview extends Component {
  constructor() {
    super();

    this.state = {
      rating: 0,
      modalIsOpen: false,
      modalInfo: null,
      // the files that will be uploaded to DB or wherever
      images: [],
      imagePreviews: [],
      currentImageID: 0,
    };

    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  componentDidUpdate = () => {
    if (this.state.modalIsOpen !== this.props.open) {
      this.openModal();
    }
  };

  openModal() {
    this.setState({ modalIsOpen: this.props.open });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
    this.props.showModal(false);
  }

  starRating = rating => {
    this.setState({ rating });
  };

  submitReview = () => {
    this.closeModal();
    // I'll focus on this after we do some db stuff
  };

  handleImageChange = event => {
    let reader = new FileReader();
    let file = event.target.files[0];
    // keep track of images to allow removal
    let currentImageID = this.state.currentImageID;

    // check to see if the image has already been uploaded
    let includes = false;
    this.state.images.forEach(image => {
      if (image.image.id === file.name) return (includes = true);
    });

    if (includes) window.alert('File already added');
    if (file && !includes) {
      reader.onloadend = () => {
        let { imagePreviews, images } = this.state;

        // create new Image element
        var image = new Image();
        // set the src of the image to the resulting url of the reader
        image.src = reader.result;
        // set the id to the file.name
        // cheap way to make sure an image isn't added twice
        image.setAttribute('id', file.name);

        // add the image preview to the array
        imagePreviews.push({ id: currentImageID, preview: reader.result });
        // add the image and file to the images array for the db on submit
        // may not need the image, not sure yet
        images.push({ id: currentImageID, image, file });
        this.setState({ currentImageID: ++currentImageID, imagePreviews, images });
      };
      reader.readAsDataURL(file);
    }
  };

  removeImage = event => {
    let choice = window.confirm('Are you sure you want to delete this image?');
    if (choice) {
      // update the images
      let images = this.state.images.filter(image => {
        return image.id !== Number(event.target.id);
      });
      // update the image previews
      let imagePreviews = this.state.imagePreviews.filter(image => {
        return image.preview !== event.target.src;
      });
      this.setState({ images, imagePreviews });
    }
  };

  render() {
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        style={modalStyles}
        contentLabel="New Review Modal">
        <div className="new-review">
          {this.state.modalIsOpen ? (
            <div className="new-review__modal">
              <div className="modal__header">New Review</div>
              <div className="modal__body">
                <div className="body__images">
                  {this.state.imagePreviews.length
                    ? this.state.imagePreviews.map((image, i) => {
                        return (
                          <div key={i} className="images__previews">
                            <img
                              alt="preview"
                              id={image.id}
                              src={image.preview}
                              className="previews__preview"
                              onClick={this.removeImage}
                            />
                            <div className="previews__text"> Click Image to Remove </div>
                          </div>
                        );
                      })
                    : null}
                  {this.state.images.length < 4 ? (
                    <div className="images__image">
                      <label htmlFor="file-upload">
                        <i className="image__add fas fa-plus-square fa-5x" />
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        onChange={this.handleImageChange}
                        onClick={event => {
                          event.target.value = null;
                        }}
                      />
                      <div className="image__text">Add an Image</div>
                    </div>
                  ) : null}
                </div>
                <div className="body__title">
                  <div className="title__label">Title:</div>
                  <input className="title__info" />
                </div>
                <div className="body__review">
                  <div className="review__label">Review:</div>
                  <textarea className="review__info" />
                </div>
                <div className="body__stars">
                  Star Rating:
                  <div className="stars__rating">
                    <StarRatings
                      rating={this.state.rating}
                      starRatedColor="gold"
                      changeRating={this.starRating}
                      numberOfStars={5}
                      name="rating"
                    />
                  </div>
                </div>
              </div>
              <div className="modal__footer">
                <button className="footer__button" onClick={this.submitReview}>
                  Submit
                </button>
                <button className="footer__button" onClick={this.closeModal}>
                  Close
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
    );
  }
}
