import React, { Component } from 'react';
import axios from 'axios';
import { CardElement, injectStripe } from 'react-stripe-elements';

class StripePayment extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {
      complete: false,
      loading: false,
      selectedRadio: 'oneMonth',
      name: '',
    };
  }

  async submit(event) {
    event.preventDefault();
    this.setState({loading: true})
    let { token } = await this.props.stripe.createToken({ name: this.state.name });
    axios
      .post('http://localhost:3001/charge', { token, selectedRadio: this.state.selectedRadio })
      .then(response => {
        this.setState({ complete: true });
        this.props.checkPayment(true);
      })
      .catch(error => {
        console.log({ error });
      });
  }

  handleRadioChange = event => {
    this.setState({ selectedRadio: event.target.id });
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div className="stripe">
        <CardElement />
        <div className="stripe__name">
          <label>
            Name on the credit card:
            <input
              className="name__input"
              placeholder="John M. Smith..."
              name="name"
              type="name"
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </label>
        </div>
        <div className="radio">
          <label>
            <input
              type="radio"
              id="oneMonth"
              checked={this.state.selectedRadio === 'oneMonth'}
              onChange={this.handleRadioChange}
            />
            -- 1 Month: $9.99
          </label>
        </div>
        <div className="radio">
          <label>
            <input
              type="radio"
              id="oneYear"
              checked={this.state.selectedRadio === 'oneYear'}
              onChange={this.handleRadioChange}
            />
            -- 1 Year: $49.99 (Save $69.89)
          </label>
        </div>
        {!this.state.complete ? (
          this.state.loading ? (
            <div>Verifying...</div>
          ) : (
            <button onClick={this.submit.bind()}>Submit Payment</button>
          )
        ) : null}
        {this.state.complete ? <div>Payment Complete!</div> : null}
      </div>
    );
  }
}

export default injectStripe(StripePayment);
