import React, { Component } from 'react';
import axios from 'axios';
import NavBar from './NavBar';
import { withRouter } from 'react-router-dom';
import '../css/SignIn.css';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      errorMessage: '',
    };
  }

  signIn = event => {   
  
    axios.post('https://cryptic-brook-22003.herokuapp.com/login', this.state)
    .then(response => {
      // localStorage.setItem('token', response.data.token)
      // localStorage.setItem('username', this.state.username)
      this.setState({
        error: false
      });
      this.props.history.push(`/`)
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
        <div className="signin-container">
          <div className="signin-container__header"> Login </div>
          <div className="signin-container__form">
            <input
              className="signin-container__input"
              placeholder="Username"
              name="username"
              type="text"
              value={this.state.username}
              onChange={this.handleInputChange}
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
            </div>
          </div>
          {/* <div style={{height:'1000px', width:'0px'}} /> */}
        </div>
      </div>
    );
  }
}

export default withRouter(SignIn);

// <Link to="/">
//  <button className="signin-container__button">Home</button>
// </Link>