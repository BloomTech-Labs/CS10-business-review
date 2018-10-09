import React, { Component } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import { withRouter } from "react-router-dom";
import "../css/SignIn.css";
import googleLogo from "../imgs/google-signin.png";

let backend = process.env.REACT_APP_LOCAL_BACKEND;
let heroku = "https://cryptic-brook-22003.herokuapp.com/";
if (typeof backend !== "string") {
  backend = heroku;
}

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscribername: "",
      password: "",
      error: "",
      errorMessage: ""
    };
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  signIn = event => {
    axios
      .post(`${backend}api/user/login`, this.state)
      .then(response => {
        // localStorage.setItem('token', response.data.token)
        // localStorage.setItem('subscribername', this.state.subscribername)
        this.setState({
          error: false
        });
        this.props.history.push(`/subscriber`);
      })
      .catch(err => {
        this.setState({
          error: true,
          errorMessage: err.response.data.error
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
        <div className="signin">
          <div className="signin-container">
            <div className="signin-container__header"> Login </div>
            <div className="signin-container__form">
              <input
                className="signin-container__input"
                placeholder="Subscribername"
                name="subscribername"
                type="text"
                value={this.state.subscribername}
                onChange={this.handleInputChange}
                autoComplete="off"
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
                <button
                  type="submit"
                  className="signin-container__button"
                  onClick={this.signIn}
                >
                  Sign In
                </button>
                <img
                  alt="Google Logo"
                  src={googleLogo}
                  className="signin-container__google-auth"
                  onClick={() => {
                    window.location = `${backend}auth/google`;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SignIn);

// <Link to="/">
//  <button className="signin-container__button">Home</button>
// </Link>
