import React, { Component } from "react";
import axios from "axios";
import { CardElement, injectStripe } from "react-stripe-elements";

import "../css/Stripe.css";

let backend = process.env.REACT_APP_LOCAL_BACKEND;
let heroku = "https://cryptic-brook-22003.herokuapp.com/";
if (typeof backend !== "string") {
  backend = heroku;
}

class StripePayment extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {
      complete: false,
      loading: false,
      selectedRadio: "oneMonth",
      name: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      error: false,
    };
  }

  async submit(event) {
    event.preventDefault();

    let args = {
      name: this.state.name,
      address_country: "United States",
      address_state: this.state.state,
      address_line1: this.state.street,
      address_city: this.state.city,
    };
    if (this.state.name && this.state.state && this.state.street && this.state.city) {
      let { token } = await this.props.stripe.createToken({ ...args });
      this.setState({ loading: true });
      axios
        .post(`${backend}charge`, { args, token, selectedRadio: this.state.selectedRadio })
        .then(() => {
          this.setState({ complete: true });
        })
        .catch(error => {
          this.setState({ loading: false, error: "Failed, Check Information, Click to Try Again" });
          console.log({ error });
        });
    } else {
      window.alert("Missing information in payment section.");
    }
  }

  handleRadioChange = event => {
    this.setState({ selectedRadio: event.target.id });
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  reset = () => {
    this.setState({ complete: false });
  };

  render() {
    return (
      <div className="stripe">
        <div className="stripe__info">
          <input
            className="info__input"
            placeholder="Name on CC: John M. Smith..."
            name="name"
            type="name"
            value={this.state.name}
            onChange={this.handleInputChange}
          />
          <input
            className="info__input"
            placeholder="Street: 123 Main St...."
            name="street"
            type="street"
            value={this.state.street}
            onChange={this.handleInputChange}
          />
          <input
            className="info__input"
            placeholder="City: Knoxville..."
            name="city"
            type="city"
            value={this.state.city}
            onChange={this.handleInputChange}
          />
          <input
            className="info__input"
            placeholder="State: TN..."
            name="state"
            type="state"
            value={this.state.state}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="stripe__radio">
          <div>
            <label className="radio__section" onChange={this.handleRadioChange}>
              <input
                className="radio__button"
                type="radio"
                id="oneMonth"
                checked={this.state.selectedRadio === "oneMonth"}
                onChange={this.handleRadioChange}
              />
               <div className="radio__label">1 Month: $9.99</div>
            </label>
          </div>
          <div>
            <label className="radio__section" onChange={this.handleRadioChange}>
              <input
                className="radio__button"
                type="radio"
                id="oneYear"
                checked={this.state.selectedRadio === "oneYear"}
                onChange={this.handleRadioChange}
              />
              <div className="radio__label">1 Year: $49.99</div>
            </label>
          </div>
        </div>
        <CardElement
          className="stripe__element"
          style={{
            base: {
              fontSize: "20px",
              color: "#05386b",
              letterSpacing: "0.025em",
              fontFamily: "Source Code Pro, monospace",
              "::placeholder": {
                color: "#05386b",
              },
              iconColor: "#05386b",
            },
            invalid: {
              color: "#red",
            },
          }}
        />
        {!this.state.complete ? (
          this.state.loading ? (
            <div className="stripe__button">Verifying...</div>
          ) : (
            <button className="stripe__button" onClick={this.submit.bind()}>
              Submit Payment
            </button>
          )
        ) : null}
        {this.state.complete && !this.state.error ? (
          <div className="stripe__button">Payment Complete!</div>
        ) : (
          <div onClick={this.reset}>{this.state.error}</div>
        )}
      </div>
    );
  }
}

export default injectStripe(StripePayment);
