import React, { Component } from 'react';
import axios from 'axios';
import { CardElement, injectStripe } from 'react-stripe-elements';

import '../css/Stripe.css';

class StripePayment extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {
      complete: false,
      loading: false,
      selectedRadio: 'oneMonth',
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      error: false,
    };
  }

  async submit(event) {
    event.preventDefault();

    let args = {
      billing_name: this.state.name,
      billing_address_country: 'United States',
      billing_address_state: this.state.state,
      billing_address_line1: this.state.street,
      billing_address_city: this.state.city,
      billing_address_country_code: 'US',
    };
    if (this.state.name && this.state.state && this.state.street && this.state.city) {
      let { token } = await this.props.stripe.createToken({ args });

      this.setState({ loading: true });

      axios
        .post('http://localhost:3001/charge', { token, selectedRadio: this.state.selectedRadio })
        .then(response => {
          this.setState({ complete: true });
          this.props.checkPayment(true);
        })
        .catch(error => {
          this.setState({ loading: false, error: 'Failed, Check Information, Click to Try Again' });
          console.log({ error });
        });
    } else {
      window.alert('Missing information in payment section.');
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
          <div className="info__label">
            Name on the credit card:
            <input
              className="info__input"
              placeholder="John M. Smith..."
              name="name"
              type="name"
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="info__label">
            Street:
            <input
              className="info__input"
              placeholder="123 Main St...."
              name="street"
              type="street"
              value={this.state.street}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="info__label">
            City:
            <input
              className="info__input"
              placeholder="Knoxville..."
              name="city"
              type="city"
              value={this.state.city}
              onChange={this.handleInputChange}
            />
          </div>
          {/* Turn this into a dropdown eventually */}
          <div className="info__label">
            State:
            <input
              className="info__input"
              placeholder="TN..."
              name="state"
              type="state"
              value={this.state.state}
              onChange={this.handleInputChange}
            />
          </div>
        </div>
        <div className="stripe__radio">
          <div>
            <label className="radio__label">
              <input
                className="radio__button"
                type="radio"
                id="oneMonth"
                checked={this.state.selectedRadio === 'oneMonth'}
                onChange={this.handleRadioChange}
              />
              -- 1 Month: $9.99
            </label>
          </div>
          <div>
            <label className="radio__label">
              <input
                className="radio__button"
                type="radio"
                id="oneYear"
                checked={this.state.selectedRadio === 'oneYear'}
                onChange={this.handleRadioChange}
              />
              -- 1 Year: $49.99 (Save $69.89)
            </label>
          </div>
        </div>
        <CardElement
          className="stripe__element"
          style={{
            base: {
              iconColor: 'rgb(0,0,0)',
              color: '#31325F',
              fontSize: '25px',
            },
          }}
        />
        {!this.state.complete ? (
          this.state.loading ? (
            <div>Verifying...</div>
          ) : (
            <button className="stripe__button" onClick={this.submit.bind()}>
              Submit Payment
            </button>
          )
        ) : null}
        {this.state.complete && !this.state.error ? (
          <div>Payment Complete!</div>
        ) : (
          <div onClick={this.reset}>{this.state.error}</div>
        )}
      </div>
    );
  }
}

export default injectStripe(StripePayment);
