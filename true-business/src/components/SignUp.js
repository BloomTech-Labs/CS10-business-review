import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import axios from 'axios';

import '../css/SignUp.css';

class SignUp extends Component {
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
      <div className="signup-container">
        <div className="signup-container__header"> Sign Up </div>
        <div className="signup-container__form">
          <input
            className="signup-container__input"
            placeholder="Username"
            name="username"
            type="text"
            value={this.state.username}
            onChange={this.handleInputChange}
          />
          <input
            className="signup-container__input"
            placeholder="E-mail"
            name="email"
            type="email"
            value={this.state.username}
            onChange={this.handleInputChange}
          />
          <input
            className="signup-container__input"
            placeholder="Password"
            name="confirmPassword"
            type="password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
          <input
            className="signup-container__input"
            placeholder="Confirm Password"
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
          <div className="signup-container__buttons ">
            <button id="signup-submit" type="submit" className="signup-container__button" onClick={this.login}>
              Sign In
            </button>
            <Popover placement="bottom" isOpen={this.state.popoverOpen} target="signup-submit" toggle={this.toggle}>
              <PopoverHeader>Login Failed</PopoverHeader>
              <PopoverBody>Failed To Proved Proper Username or Password</PopoverBody>
              <button className="popover-button" onClick={this.toggle}>
                Close
              </button>
            </Popover>
            <Link to="/">
              <button className="signup-container__button">Home</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;
