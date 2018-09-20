import React, { Component } from 'react';
import axios from 'axios';
import { CardElement, injectStripe } from 'react-stripe-elements';

class StripePayment extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.state = {
      complete: false,
    };
  }

  async submit(event) {
    event.preventDefault();
    let { token } = await this.props.stripe.createToken({ name: 'Name' });
    axios
      .post('http://localhost:3001/charge', token)
      .then(response => {
        this.setState({ complete: true });
        this.props.checkPayment(true);
      })
      .catch(error => {
        console.log({error});
      });
  }

  render() {
    return (
      <div className="checkout">
        <CardElement />
        {this.state.complete ? null : <button onClick={this.submit}>Submit Payment</button>}
        {this.state.complete ? <div>Payment Complete!</div> : null}
      </div>
    );
  }
}

export default injectStripe(StripePayment);
