import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Modal from "react-modal";
import { Popover, PopoverBody } from "reactstrap";
import { Button, Menu, MenuItem } from "@material-ui/core";

import logo from "../imgs/logo.png";

import "../css/NavBar.css";

let popoverStyles = {
  content: {
    backgroundColor: "rgb(62, 56, 146)",
    overflow: "hidden",
  },
};

// let modalStyles = {
//   content: {
//     top: "15%",
//     left: "50%",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//     height: "20vh",
//     width: "30vw",
//     zIndex: "5",
//     backgroundColor: "rgb(238,238,238)",
//     color: "rgb(5,56,107)",
//     overflow: "hidden",
//   },
// };

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
      searchWord: "",
      searchCity: "",
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

  noPopUpInSearch = () => {
    if (localStorage.getItem("token")) {
      this.setState({ signedIn: true });
    } else {
      this.setState({
        signedIn: false,
      });
    }
  };

  componentDidMount = () => {
    if (this.state.signedIn && this.state.popoverOpen) this.setState({ popoverOpen: false });
  };

  componentDidUpdate = () => {
    if (this.state.signedIn && this.state.popoverOpen) this.setState({ popoverOpen: false });
  };

  toggle = event => {
    // Only fires the popover the first time they click on the search bar
    if (!this.state.popoverFired) {
      this.setState({ popoverOpen: true, popoverFired: true });
    } else {
      this.setState({ popoverOpen: false });
    }
    this.noPopUpInSearch();
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSearch = event => {
    event.preventDefault();
    if (this.state.searchWord !== "" && !this.state.popoverOpen) {
      this.props.search(this.state.searchWord + " " + this.state.searchCity, true);
      this.setState({ searchWord: "", searchCity: "" });
    } else {
      window.alert("Enter Search Term and City")
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
          <form className="center__search">
            <input
              value={this.state.searchWord}
              autoComplete="off"
              placeholder="Tacos, Groceries, Drugstore..."
              onClick={this.toggle}
              onChange={this.handleInputChange.bind(this)}
              name="searchWord"
              id="signInPop"
              className="search__input"
            />
            <input
              value={this.state.searchCity}
              autoComplete="off"
              placeholder="Seattle Washington, Osaka Japan..."
              onClick={this.toggle}
              onChange={this.handleInputChange.bind(this)}
              name="searchCity"
              className="search__input"
            />
            <button type="submit" id="Search" className="search__button" onClick={this.handleSearch}>
              <i className="fa fa-search" />
            </button>
          </form>
          {/* <Modal
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
          </Modal> */}
          {this.state.signedIn ? null : (
            <Popover
              styles={{ popoverStyles }}
              placement="top"
              isOpen={this.state.popoverOpen}
              target="signInPop"
              toggle={this.toggle}>
              <PopoverBody>
                <i className="far fa-smile-wink fa-2x" />
                <div className="popover__text">Users don't see this!</div>
              </PopoverBody>
              <button type="submit" className="popover__button" onClick={this.toggle}>
                Close
              </button>
            </Popover>
          )}
        </div>
        {localStorage.getItem("token") && localStorage.getItem("userId") ? (
          <div className="navbar__right--logged">
            <Button
              aria-owns={this.state.anchorEl ? "simple-menu" : null}
              aria-haspopup="true"
              onClick={this.handleClick}>
              <i className="fas fa-bars fa-2x fa-fw" />
              <div className="right--logged__text">{localStorage.getItem("name").split(" ")[0]}</div>
            </Button>
            <Menu
              id="simple-menu"
              style={{ top: "3rem", left: "1rem" }}
              anchorEl={this.state.anchorEl}
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose}>
              <MenuItem
                onClick={() => {
                  this.props.history.push(`/user`);
                }}>
                My Account
              </MenuItem>
              <MenuItem onClick={this.logout}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <div className="navbar__right">
            <button
              className="right__sign"
              onClick={() => {
                this.props.history.push(`/signup`);
              }}>
              Sign Up
              <i className="fa fa-user-plus" />
            </button>
            <button
              className="right__sign"
              onClick={() => {
                this.props.history.push(`/signin`);
              }}>
              Sign In
              <i className="fas fa-sign-in-alt" />
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(NavBar);
