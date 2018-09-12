import React, { Component } from 'react';
import axios from 'axios';

import NavBar from './NavBar';

import '../css/SignUp.css';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      error: '',
      errorMessage: '',
    };
  }

  confirmPassword = () => {
    return this.state.password === this.state.confirmPassword;
  }

  confirmEmail = () => {
    return this.state.email === this.state.confirmEmail;
  }

  createUser = event => {
    event.preventDefault();
    const user = {
      username: this.state.username,
      password: this.state.password
    };

    axios.post('http://localhost:3000/register', user)
    .then(response => {
      localStorage.setItem('token', response.data.token)
      this.props.history.push(`/signin`)
      this.setState({
        error: false
      });
    })
    .catch(err => {
      this.setState({
        error: true,
        errorMessage: err.response.data.error
      })
    })
  }

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    return (
      <div>
        <NavBar search={this.props.search} />
        <div className="signup-container">
          <div className="signup-container__header"> Sign Up </div>
          <form className="signup-container__form">
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
              value={this.state.email}
              onChange={this.handleInputChange}
            />
            <input
              className="signup-container__input"
              placeholder="Password"
              name="confirmPassword"
              type="password"
              value={this.state.confirmPassword}
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
              <button id="signup-submit" type="submit" className="signup-container__button" onClick={this.createUser}>
                Confirm
              </button>
            </div>
          </form>
          <div className="signup-container__form" />
        </div>
      </div>
    );
  }
}

export default SignUp;

/* <Link to="/">
    <button className="signup-container__button">Home</button>
</Link> */
