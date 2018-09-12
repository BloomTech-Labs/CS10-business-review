import React, { Component } from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';

import logo from '../imgs/logo.png';

import '../css/NavBar.css';

let customStyles = {
  content: {
    top: '15%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: '20%',
    width: '40%',
    zIndex:'5',
  },
};

class NavBar extends Component {
  constructor() {
    super();

    this.state = {
      modalIsOpen: false,
      modalInfo: null,
      popoverOpen: false,
      popoverFired: false,
      search: '',
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  openModal(info, event) {
    this.setState({ modalIsOpen: true, modalInfo: info });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  toggle = event => {
    // Only fires the popover the first time they click on the search bar
    if (!this.state.popoverFired) {
      this.setState({ popoverOpen: true, popoverFired: true });
    } else {
      this.setState({ popoverOpen: false });
    }
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSearch = event => {
    if (this.state.search !== '') {
      this.props.search(this.state.search);
      this.props.history.push(`/results`);
      this.setState({ search: '' });
    } else {
      // For the time being, do this.
      // Eventually, Have it bring up a random business like Yelp.
      this.openModal();
    }
  };  

  render() {
    return (
      <div className="navbar-container">
        <img
          alt="logo"
          src={logo}
          className="navbar-container__logo"
          onClick={() => {
            this.props.history.push(`/`);
          }}
        />
        <div className="navbar-container__center">
          <input
            value={this.state.search}
            autoComplete="off"
            placeholder="Search..."
            onClick={this.toggle}
            onChange={this.handleInputChange.bind(this)}
            name="search"
            id="signInPop"
            className="navbar-container__input"
          />
          <div className="navbar-container__buttons">
            <button className="navbar-container__button">Review </button>
            <button type="submit" id="Search" className="navbar-container__button" onClick={this.handleSearch}>
              Search
            </button>
            <Modal
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              style={customStyles}
              contentLabel="No Input Modal">
              <div className="navbar-container__modal">
                {this.state.modalIsOpen ? (
                  <div className="modal-container">
                    <div className="modal-container__title">No Search Term!</div>
                    <div className="modal-container__body">You can't very well search for nothing...</div>
                    <div className="modal-container__footer">
                      <button className="footer__button" onClick={this.closeModal}>
                        close
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </Modal>
          </div>
          <Popover placement="top" isOpen={this.state.popoverOpen} target="signInPop" toggle={this.toggle}>
            <PopoverHeader>Sign In?</PopoverHeader>
            <PopoverBody>Users who sign can see unlimited reviews!</PopoverBody>
            <button className="popover-button" onClick={this.toggle}>
              Close
            </button>
          </Popover>
        </div>
        <div className="navbar-container__right">
          <div
            className="navbar-container__sign"
            onClick={() => {
              this.props.history.push(`/signup`);
            }}>
            Sign Up
          </div>
          <div
            className="navbar-container__sign"
            onClick={() => {
              this.props.history.push(`/signin`); 
            }}>
            Sign In
          </div>
        </div>       
      </div>
    );
  }
}

export default withRouter(NavBar);
