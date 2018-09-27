import React, { Component } from "react";
import Modal from "react-modal";
import StarRatings from "react-star-ratings";
import axios from "axios";
import Dropzone from "react-dropzone";

import "../css/NewReview.css";

let modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "90%",
    width: "75%",
    zIndex: "5",
    backgroundColor: "rgb(62, 56, 146)",
    overflow: "hidden"
  }
};

Modal.setAppElement("div");

export default class NewReview extends Component {
  constructor() {
    super();

    this.state = {
      stars: 0,
      modalIsOpen: false,
      modalInfo: null,
      photos: [],
      imagePreviews: [],
      currentImageID: 0,
      title: "",
      body: "",
      rating: 0
    };

    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  componentDidUpdate = () => {
    if (this.state.modalIsOpen !== this.props.open) {
      this.openModal();
    }
    if (this.state.newBusinessID !== this.props.newBusinessID) {
      this.setState({ newBusinessID: this.props.newBusinessID });
    }
  };

  openModal() {
    this.setState({ modalIsOpen: this.props.open });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
    this.props.showModal(false);
  }
  handleDrop = files => {
    const uploaders = files.map(file => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tags", ``);
      formData.append("upload_preset", "true-business"); // Replace the preset name with your own
      formData.append("api_key", process.env.REACT_APP_CLOUDINARY_API_KEY); // Replace API key with your own Cloudinary key
      formData.append("timestamp", (Date.now() / 1000) | 0);

      // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
      return axios
        .post(
          "https://api.cloudinary.com/v1_1/ddhamypia/image/upload",
          formData,
          {
            headers: { "X-Requested-With": "XMLHttpRequest" }
          }
        )
        .then(response => {
          const data = response.data;
          const fileURL = data.secure_url; // You should store this URL for future references in your app
          console.log(data);
        });
    });
  };
  // axios.all(uploaders) => {
  //   // ... perform after upload is successful operation
  // });

  starRating = rating => {
    this.setState({ rating });
  };

  submitReview = () => {
    let review = {
      newMongoId: this.props.newMongoId,
      newGoogleId: this.props.newGoogleId,
      title: this.state.title,
      body: this.state.body,
      stars: this.state.rating,
      photos: ["http://grossfood.com"]
    };
    axios
      .post("http://localhost:3001/api/review/create", review)
      .then(response => {
        this.closeModal();
      })
      .catch(error => {
        console.log("Error:", error);
      });
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <Modal
        shouldCloseOnOverlayClick={false}
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        style={modalStyles}
        contentLabel="New Review Modal"
      >
        <div className="new-review">
          {this.state.modalIsOpen ? (
            <div className="new-review__modal">
              <div className="modal__header">New Review</div>
              <div className="modal__body">
                <div>
                  <Dropzone onDrop={this.handleDrop} multiple accept="image/*">
                    <p>Drop your files or click here to upload</p>
                  </Dropzone>
                </div>

                <div className="body__title">
                  <div className="title__label">Title:</div>
                  <input
                    className="title__info"
                    placeholder="So Gross..."
                    name="title"
                    type="text"
                    value={this.state.title}
                    onChange={this.handleInputChange}
                    autoComplete="off"
                  />
                </div>
                <div className="body__review">
                  <div className="review__label">Review:</div>
                  <textarea
                    className="review__info"
                    placeholder="I found a hair in my food..."
                    name="body"
                    type="text"
                    value={this.state.body}
                    onChange={this.handleInputChange}
                    autoComplete="off"
                  />
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
