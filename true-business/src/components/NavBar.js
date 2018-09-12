import React, { Component } from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import { withRouter, Route } from 'react-router-dom';
import Search from './Search';

import logo from '../imgs/logo.png';

import '../css/NavBar.css';

class NavBar extends Component {
  state = {
    popoverOpen: false,
    search: ''
  };

  toggle = () => {
    this.setState({ popoverOpen: !this.state.popoverOpen });
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  searchWord = (event) => {
   console.log("Fire",this.state.search);
    event.preventDefault();
    const newSearch = {
        search: this.state.search
    };

    // this.props.search(newSearch);
    //     this.setState({
    //         search: '',

    //     });
  }
  render() {
    return (
      <div className="navbar-container">
        <img src={logo} className="navbar-container__logo" />
        <div className="navbar-container__center">
          <input onClick={this.toggle} id="signInPop" style={{ width: '200px' }} 
          className="navbar-container__input" placeholder="search" type="text" name="search" value={this.state.search} onChange={this.handleInputChange}  />
          <div className="navbar-container__buttons">
            <button className="navbar-container__button">Review </button>
            <button className="navbar-container__button" onClick={this.searchWord} >Search </button>
          </div>
          <Popover
            placement="bottom"
            isOpen={this.state.popoverOpen}
            target="signInPop"
            toggle={this.toggle}>
            <PopoverHeader>Sign In?</PopoverHeader>
            <PopoverBody>
              Users who sign can see unlimited reviews!
              
            </PopoverBody>
            <button className="popover-button" onClick={this.toggle}>Close</button>
          </Popover>
        </div>
        <div className="navbar-container__right">
          <div
            className="navbar-container__sign"
            onClick={() => {
              this.props.history.push(`/signup`);
            }}>
            Sign Up
          </div>
          <div
            className="navbar-container__sign"
            onClick={() => {
              this.props.history.push(`/signin`); 
            }}>
            Sign In
          </div>
        </div>
         <Search  state={this.state}/> 
      </div>
    );
  }
}

export default withRouter(NavBar);
