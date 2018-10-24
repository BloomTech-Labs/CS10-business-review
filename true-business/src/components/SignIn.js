import React, { Component } from 'react';
import axios from 'axios';
import logo from '../imgs/logo.png';
import { withRouter } from 'react-router-dom';

import '../css/SignIn.css';

let backend = process.env.REACT_APP_LOCAL_BACKEND;
let heroku = 'https://cryptic-brook-22003.herokuapp.com/';
if (typeof backend !== 'string') {
  backend = heroku;
}

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: false,
      errorMessage: '',
    };
  }

  componentDidMount = () => {
    window.scrollTo(0, 0);
  };

  signIn = event => {
    event.preventDefault();
    if (!this.state.username || !this.state.password) {
      this.setState({
        error: true,
        errorMessage: 'Please provide a username and password!',
      });
    } else {
      axios
        .post(`${backend}api/user/login`, { username: this.state.username, password: this.state.password })
        .then(response => {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userId', response.data._doc._id);
          localStorage.setItem('name', response.data._doc.name);
          localStorage.setItem('accountType', response.data._doc.accountType);
          localStorage.setItem('accountDeactivated', response.data._doc.accountDeactivated);
          localStorage.setItem('userImage', response.data._doc.userImages[0].link);
          this.setState({
            error: false,
          });
          this.props.history.push(`/user`);
        })
        .catch(err => {
          this.setState({
            error: true,
            errorMessage: 'Incorrect username or password',
          });
        });
    }
  };

  googleSignIn = google => {
    axios
      .post(`${backend}api/user/current`, { google })
      .then(response => {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data._doc._id);
        localStorage.setItem('name', response.data._doc.name);
        localStorage.setItem('accountType', response.data._doc.accountType);
        localStorage.setItem('accountDeactivated', response.data._doc.accountDeactivated);
        localStorage.setItem('userImage', response.data._doc.userImages[0].link);
        this.setState({
          error: false,
        });
        this.props.history.push(`/user`);
      })
      .catch(err => {
        this.setState({
          error: true,
          errorMessage: 'No Account Found for this Google Account.',
        });
      });
  };

  googleFail = () => {
    this.setState({ error: true, errorMessage: 'Google Sign In Failing, Sorry for the Inconvenience.' });
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    if (this.state.username !== '' && this.state.password !== '') {
      this.setState({
        error: false,
        errorMessage: '',
      });
    }
  };

  render() {
    return (
      <div>
        <div className="signin">
          <img
            alt="logo"
            src={logo}
            className="signin__logo"
            onClick={() => {
              this.props.history.push(`/`);
            }}
          />
          <div className="signin-container">
            <div className="signin-container__header"> Sign In </div>
            <form className="signin-container__form">
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
              <button type="submit" className="signin-container__button" onClick={this.signIn}>
                Continue
              </button>
              {!this.state.error ? (
                <div className="form__error" />
              ) : (
                <div className="form__error"> {this.state.errorMessage} </div>
              )}
            </form>
            <hr/>
            <div className="signin__new">
              <div className="new__text">New To True Business Reviews?</div>
              <button className="new__button" onClick={() => this.props.history.push(`/signup`)}>
                Sign Up
              </button>
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
