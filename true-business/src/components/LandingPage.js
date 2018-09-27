import React, { Component } from "react";
import Modal from "react-modal";
import BusinessThumbnail from "./BusinessThumbnail";
import "../css/LandingPage.css";
import "../css/GeneralStyles.css";
import Dropzone from "react-dropzone";
import axios from "axios";

import NavBar from "./NavBar";

let modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "75%",
    width: "50%",
    zIndex: "5",
    backgroundColor: "rgb(62, 56, 146)",
    overflowY: "scroll"
  }
};

Modal.setAppElement("div");

class LandingPage extends Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      modalInfo: null
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal(info, event) {
    this.setState({ modalIsOpen: true, modalInfo: info });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

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

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        <div className="landing-container">
          <div className="landing-container__reviews-container">
            <div className="landing-container__title">Popular Reviews</div>
            <div className="landing-container__reviews">
              {this.props.businesses.map(business => {
                return (
                  <div
                    key={business._id}
                    onClick={() => this.openModal(this, business)}
                  >
                    <BusinessThumbnail business={business} key={business._id} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="landing-container__reviews-container">
            <div className="landing-container__title">Popular Businesses</div>
            <div className="landing-container__reviews">
              {this.props.businesses.map(business => {
                return (
                  <div
                    key={business._id}
                    onClick={() => this.props.getBusiness(business, true)}
                  >
                    <BusinessThumbnail business={business} key={business._id} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="landing-container__reviews-container">
            <div className="landing-container__title">Popular Reviewers</div>
            <div className="landing-container__reviews">
              <div className="landing-container__review">
                <div className="landing-container__picture" />
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" />
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" />
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" />
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
              <div className="landing-container__review">
                <div className="landing-container__picture" />
                <ul className="landing-container__item--hover">@Reviewer</ul>
              </div>
            </div>
          </div>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={modalStyles}
            contentLabel="Review Modal"
          >
            <div className="landing-container__modal">
              {this.state.modalIsOpen ? (
                <div className="modal-container">
                  <div className="modal__header">
                    <div className="header__title">
                      {this.state.modalInfo.title}
                    </div>
                    <div className="header__reviewer">
                      {this.state.modalInfo.reviewer}
                    </div>
                  </div>
                  <div className="modal__body">
                    <div className="body__image">
                      {this.state.modalInfo.image}
                    </div>
                    <div className="body__stars">
                      {this.state.modalInfo.stars}
                    </div>
                    <div className="body__review">
                      {this.state.modalInfo.review}
                    </div>
                  </div>
                  <div className="modal__footer">
                    <button
                      className="footer__button"
                      onClick={this.closeModal}
                    >
                      close
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </Modal>
        </div>
        <div>
          <Dropzone onDrop={this.handleDrop} multiple accept="image/*">
            <p>Drop your files or click here to upload</p>
          </Dropzone>
        </div>
      </div>
    );
  }
}

export default LandingPage;
