import React, { Component } from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import { withRouter } from 'react-router-dom';

import logo from '../imgs/logo.png';

import '../css/NavBar.css';

class NavBar extends Component {
  state = {
    popoverOpen: false,
    popoverFired: false,
    search: '',
  };

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

  render() {
    return (
      <div className="navbar-container">
        <img alt="logo" src={logo} className="navbar-container__logo" />
        <div className="navbar-container__center">
          <input
            autoComplete="off"
            placeholder="Search..."
            onClick={this.toggle}
            onChange={this.handleInputChange.bind(this)}
            name="search"
            id="signInPop"
            style={{ width: '200px' }}
            className="navbar-container__input"
          />
          <div className="navbar-container__buttons">
            <button className="navbar-container__button">Review </button>
            <button className="navbar-container__button">
              Search
            </button>
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
