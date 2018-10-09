import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import NavBar from "./NavBar";

import { Elements, StripeProvider } from "react-stripe-elements";
import StripePayment from "./StripePayment";

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
      subscribername: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      error: "",
      errorMessage: "",
      payment: false,
      type: null
    };
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  confirmPassword = () => {
    return this.state.password === this.state.confirmPassword;
  };

  confirmEmail = () => {
    return this.state.email === this.state.confirmEmail;
  };

  createSubscriber = event => {
    event.preventDefault();
    const subscriber = {
      email: this.state.email,
      subscribername: this.state.subscribername,
      password: this.state.password,
      accountType: this.state.type
    };
    this.state.payment
      ? axios
          .post("http://localhost:3001/register", subscriber)
          .then(() => {
            this.setState({
              error: false
            });
            this.props.history.push(`/signin`);
          })
          .catch(err => {
            this.setState({
              error: true,
              errorMessage: err
            });
          })
      : window.alert("You must submit payment first");
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
                placeholder="Subscribername"
                name="subscribername"
                type="text"
                value={this.state.subscribername}
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
              <StripeProvider apiKey="pk_test_a80QBoWXww54ttxUn5cMQO1o">
                <div className="signup-container__stripe">
                  <Elements>
                    <StripePayment checkPayment={this.checkPayment} />
                  </Elements>
                </div>
              </StripeProvider>
              <div className="signup-container__buttons ">
                <button
                  id="signup-submit"
                  type="submit"
                  className="signup-container__button"
                  onClick={this.createSubscriber}
                >
                  Confirm
                </button>
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
