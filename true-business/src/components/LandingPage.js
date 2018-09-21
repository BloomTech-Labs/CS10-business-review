import React, { Component } from 'react';
import Modal from 'react-modal';
import {  Row } from 'reactstrap';
import BusinessThumbnail from './BusinessThumbnail';
import '../css/LandingPage.css';
import '../css/GeneralStyles.css';

import NavBar from './NavBar';

let modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '75%',
    width: '50%',
    zIndex: '5',
    backgroundColor: 'darkslategrey',
    overflow: 'hidden',
  },
};

Modal.setAppElement('div');

class LandingPage extends Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      modalInfo: null,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);    
  };

  openModal(info, event) {
    this.setState({ modalIsOpen: true, modalInfo: info });
  }
  
  closeModal() {
    this.setState({ modalIsOpen: false });
  }
  
  render() {
    return (
      <div>      
        <NavBar search={this.props.search} />
        <div className="landing-container">
          <div className="landing-container__reviews-container">
            <div className="landing-container__title">High Rated Business</div>           
                <div className="business-section">{this.props.businesses.map(business => { 
                  // Using this until we decide what will constitute Featured Reviews
                  if (business.stars === 0) {
                    
                  return <div onClick={()=>this.props.getBusiness(business, true)}> < BusinessThumbnail business={business} key={business._id}/> </div>                 
                  
               }})} </div>                     
            
          </div>            
          <div className="landing-container__reviews-container">
            <div className="landing-container__title">Popular Businesses</div>
            <div className="landing-container__reviews">    
            <Row className="business-section">{this.props.businesses.map(business => {
              // Using this until we decide what will constitute Popular Reviews        
              if (business.popularity) {                    
                  return < BusinessThumbnail business={business} key={business._id}/>                   
               }})} </Row>   
           
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
            contentLabel="Review Modal">
            <div className="landing-container__modal">
              {this.state.modalIsOpen ? (
                <div className="modal-container">
                  <div className="modal__header">
                    <div className="header__title">{this.state.modalInfo.title}</div>
                    <div className="header__reviewer">{this.state.modalInfo.reviewer}</div>
                  </div>
                  <div className="modal__body">
                    <div className="body__image">{this.state.modalInfo.image}</div>
                    <div className="body__stars">{this.state.modalInfo.stars}</div>
                    <div className="body__review">{this.state.modalInfo.review}</div>
                  </div>
                  <div className="modal__footer">
                    <button className="footer__button" onClick={this.closeModal}>
                      close
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default LandingPage;
