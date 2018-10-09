import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import logo from "../imgs/logo.png";
// import signUp from "../imgs/signup.png";

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
      email: "",
      username: "",
      usernameError: false,
      email: "",
      confirmEmail: "",
      password: "",
      passwordError: false,
      confirmPassword: "",
      error: false,
      errorMessage: "",
      payment: false,
      type: null,
      inputError: false,
    };
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  createUser = event => {
    event.preventDefault();
    if (!this.state.usernameError && !this.state.passwordError && !this.state.inputError) {
      if (
        this.state.name === "" ||
        this.state.email === "" ||
        this.state.password === "" ||
        this.state.username === ""
      ) {
        this.setState({ inputError: true });
      } else {
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
            if (err) {
              this.setState({
                error: true,
                errorMessage: "This username already exists!",
              });
            }
          });
      }
    }
  };

  handleInputChange = event => {
    let password = document.getElementById("password").value;
    let confirm = document.getElementById("confirm").value;
    let username = document.getElementById("username").value;
    if (password !== confirm) {
      this.setState({ passwordError: true });
    } else {
      this.setState({ passwordError: false });
    }
    if (username.length > 20) {
      this.setState({ usernameError: true });
    } else {
      this.setState({ usernameError: false });
    }
    this.setState({ [event.target.name]: event.target.value });
    if (
      !(this.state.name === "" || this.state.email === "" || this.state.password === "" || this.state.username === "")
    ) {
      this.setState({ inputError: false });
    }
  };

  render() {
    return (
      <div>
        <div className="signup">
          <img
            alt="logo"
            src={logo}
            className="signup__logo"
            onClick={() => {
              this.props.history.push(`/`);
            }}
          />
          <div className="signup-container">
            <div className="signup-container__header"> Sign Up </div>
            <form className="signup-container__form">
              {this.state.errorMessage === '' ? <div className="form__error"/> : <div className="form__error"> {this.state.errorMessage} </div>}
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
                id="username"
                value={this.state.username}
                onChange={this.handleInputChange}
              />

              <input
                className="signup-container__input"
                placeholder="Password"
                name="password"
                type="password"
                id="password"
                value={this.state.password}
                onChange={this.handleInputChange}
              />
              <input
                className="signup-container__input"
                placeholder="Confirm Password"
                name="confirmPassword"
                type="password"
                id="confirm"
                value={this.state.confirmPassword}
                onChange={this.handleInputChange}
              />
              {this.state.usernameError || this.state.passwordError ? (
                this.state.passwordError ? (
                  <div className="userError">Passwords Must Match</div>
                ) : (
                  <div className="userError">Username Must be less than 25 Characters</div>
                )
              ) : (
                <div className="userError" />
              )}
              <div className="signup-container__buttons ">
                <button
                  id="signup-submit"
                  type="submit"
                  className="signup-container__button"
                  style={this.state.inputError ? { border: ".1rem solid red" } : null}
                  onClick={this.createUser}>
                  {this.state.inputError ? "Missing Fields" : "Confirm Registration"}
                </button>
                {/* <hr />
                <img
                  alt="Google Logo"
                  src={signUp}
                  className="signup-container__google-auth"
                  onClick={() => {
                    window.location = `${backend}auth/google`;
                  }}
                /> */}
              </div>
            </form>
            <div className="signup__returning">
              <div className="returning__text">Already a Member of True Business Reviews?</div>
              <button className="returning__button" onClick={() => this.props.history.push(`/signin`)}>
                Sign In
              </button>
            </div>
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
