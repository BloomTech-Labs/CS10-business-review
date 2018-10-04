import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import NavBar from "./NavBar";
import signUp from "../imgs/signup.png";

import "../css/SignUp.css";

let backend = process.env.REACT_APP_LOCAL_BACKEND;
let heroku = "https://cryptic-brook-22003.herokuapp.com/";
if (typeof backend !== "string") {
  backend = heroku;
}

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      username: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      error: "",
      errorMessage: "",
      payment: false,
      type: null,
    };
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  confirmPassword = () => {
    return this.state.password === this.state.confirmPassword;
  };

  createUser = event => {
    event.preventDefault();
    const user = {
      name: this.state.name,
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
    };
    axios
      .post(`${backend}api/user/register`, user)
      .then(() => {
        this.setState({
          error: false,
        });
        this.props.history.push(`/signin`);
      })
      .catch(err => {
        this.setState({
          error: true,
          errorMessage: err,
        });
      });
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        <div className="signup">
          <div className="signup-container">
            <div className="signup-container__header"> Sign Up </div>
            <form className="signup-container__form">
              <input
                className="signup-container__input"
                placeholder="Full Name"
                name="name"
                type="text"
                value={this.state.name}
                onChange={this.handleInputChange}
              />
              <input
                className="signup-container__input"
                placeholder="E-mail"
                name="email"
                type="email"
                value={this.state.email}
                onChange={this.handleInputChange}
              />
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
                placeholder="Password"
                name="password"
                type="password"
                value={this.state.password}
                onChange={this.handleInputChange}
              />
              <input
                className="signup-container__input"
                placeholder="confirmPassword"
                name="confirmPassword"
                type="password"
                value={this.state.confirmPassword}
                onChange={this.handleInputChange}
              />
              <div className="signup-container__buttons ">
                <button id="signup-submit" type="submit" className="signup-container__button" onClick={this.createUser}>
                  Confirm Registration
                </button>
                <hr />
                <img
                  alt="Google Logo"
                  src={signUp}
                  className="signup-container__google-auth"
                  onClick={() => {
                    window.location = `${backend}auth/google`;
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
  checkPayment = (payment, type) => {
    this.setState({ payment, type });
  };
}

export default withRouter(SignUp);

/* <Link to="/">
    <button className="signup-container__button">Home</button>
</Link> */
