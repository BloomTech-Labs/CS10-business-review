import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import axios from 'axios';

import '../css/SignIn.css';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: '',
      errorMessage: '',
    };
  }

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div className="signin-container">
        <div className="signin-container__header"> Login </div>
        <div className="signin-container__form">
          <input
            className="signin-container__input"
            placeholder="Username"
            name="username"
            type="text"
            value={this.state.username}
            onChange={this.handleInputChange}
          />
          <input
            className="signin-container__input"
            placeholder="Password"
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
          <div className="signin-container__buttons ">
            <button id="signin-submit" type="submit" className="signin-container__button" onClick={this.login}>
              Sign In
            </button>
            <Popover placement="bottom" isOpen={this.state.popoverOpen} target="signin-submit" toggle={this.toggle}>
              <PopoverHeader>Login Failed</PopoverHeader>
              <PopoverBody>Failed To Proved Proper Username or Password</PopoverBody>
              <button className="popover-button" onClick={this.toggle}>
                Close
              </button>
            </Popover>
            <Link to="/">
              <button className="signin-container__button">Home</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default SignIn;
