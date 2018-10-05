import React, { Component } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import { withRouter } from "react-router-dom";
import "../css/SignIn.css";
// import googleLogo from "../imgs/google-signin.png";

let backend = process.env.REACT_APP_LOCAL_BACKEND;
let heroku = "https://cryptic-brook-22003.herokuapp.com/";
if (typeof backend !== "string") {
  backend = heroku;
}

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: "",
      errorMessage: "",
    };
  }

  signIn = () => {
    axios
      .post(`${backend}api/user/login`, {username:this.state.username, password:this.state.password})
      .then(response => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data._doc._id);
        localStorage.setItem("name", response.data._doc.name);
        localStorage.setItem("accountType", response.data._doc.accountType);
        localStorage.setItem("accountDeactivated", response.data._doc.accountDeactivated);
        localStorage.setItem("userImage", response.data._doc.userImages[0].link);
        this.setState({
          error: false,
        });
        this.props.history.push(`/user`);
      })
      .catch(err => {
        this.setState({
          error: true,
          errorMessage: err.response.data.error,
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
            <div className="signin-container__header"> Sign In </div>
            <div className="signin-container__form">
              <input
                className="signin-container__input"
                placeholder="Username"
                name="username"
                type="text"
                value={this.state.username}
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
                <button type="submit" className="signin-container__button" onClick={this.signIn}>
                  Sign In
                </button>
                {/* <hr/> */}
                {/* <img
                  alt="Google Logo"
                  src={googleLogo}
                  className="signin-container__google-auth"
                  onClick={() => {
                    window.location = `${backend}auth/google`;
                  }}
                /> */}
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
