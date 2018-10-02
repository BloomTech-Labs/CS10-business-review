import React, { Component } from "react";
import { Popover, PopoverBody, PopoverHeader } from "reactstrap";
import { withRouter } from "react-router-dom";
import Modal from "react-modal";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import logo from "../imgs/logo.png";

import "../css/NavBar.css";

let modalStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    height: "40vh",
    width: "50vw",
    zIndex: "5",
    backgroundColor: "rgb(238,238,238)",
    color: "rgb(5,56,107)",
    overflowY: "scroll",
  },
};

let popoverStyles = {
  content: {
    backgroundColor: "rgb(62, 56, 146)",
    overflow: "hidden",
  },
};

Modal.setAppElement("div");

class NavBar extends Component {
  constructor() {
    super();

    this.state = {
      anchorEl: null,
      modalIsOpen: false,
      modalInfo: null,
      popoverOpen: false,
      popoverFired: false,
      search: "",
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.open = false;
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

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
    if (this.state.search !== "") {
      this.props.search(this.state.search, true);
      this.setState({ search: "" });
    } else {
      this.openModal();
    }
  };

  logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("accountType");
    localStorage.removeItem("accountDeactivated");
    localStorage.removeItem("userImage");
    this.props.history.push("/");
  };

  render() {
    const { anchorEl } = this.state;
    return (
      <div className="navbar">
        <img
          alt="logo"
          src={logo}
          className="navbar__logo"
          onClick={() => {
            this.props.history.push(`/`);
          }}
        />
        <div className="navbar__center">
          <input
            value={this.state.search}
            autoComplete="off"
            placeholder="Tacos in Seattle..."
            onClick={this.toggle}
            onChange={this.handleInputChange.bind(this)}
            name="search"
            id="signInPop"
            className="center__input"
          />
          <button type="submit" id="Search" className="center__button" onClick={this.handleSearch}>
            Search
          </button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={modalStyles}
            contentLabel="No Input Modal">
            <div className="modal">
              {this.state.modalIsOpen ? (
                <div className="modal">
                  <div className="modal__title">No Search Term!</div>
                  <div className="modal__body">You can't very well search for nothing...</div>
                  <div className="modal__footer">
                    <button className="footer__button" onClick={this.closeModal}>
                      Close
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </Modal>
          <Popover
            styles={{ popoverStyles }}
            placement="top"
            isOpen={this.state.popoverOpen}
            target="signInPop"
            toggle={this.toggle}>
            <PopoverHeader>Sign In?</PopoverHeader>
            <PopoverBody>Users who sign in can see unlimited reviews!</PopoverBody>
            <button type="submit" className="popover-button" onClick={this.toggle}>
              Close
            </button>
          </Popover>
        </div>
        {localStorage.getItem("token") && localStorage.getItem("userId") ? (
          <div className="navbar__right--logged">
            <div
              onClick={() => {
                this.props.history.push(`/user`);
              }}>
              Hi, {localStorage.getItem("name").split(" ")[0]}!
            </div>
            <div className="right--logged__hamburger">
              <Button aria-owns={anchorEl ? "simple-menu" : null} aria-haspopup="true" onClick={this.handleClick}>
                <i className="fas fa-bars fa-3x" />
              </Button>
              <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
                <MenuItem
                  onClick={() => {
                    this.props.history.push(`/user`);
                  }}>
                  My account
                </MenuItem>
                <MenuItem onClick={this.logout}>Logout</MenuItem>
              </Menu>
            </div>
          </div>
        ) : (
          <div className="navbar__right">
            <button
              className="right__sign"
              onClick={() => {
                this.props.history.push(`/signup`);
              }}>
              Sign Up
            </button>
            <button
              className="right__sign"
              onClick={() => {
                this.props.history.push(`/signin`);
              }}>
              Sign In
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(NavBar);
