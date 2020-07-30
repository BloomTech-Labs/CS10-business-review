import React, { Component } from "react";
import NavBar from "./NavBar";
import { withRouter } from "react-router-dom";

import "../css/Redirect.css";


 class Redirect extends Component {
    componentDidMount = () => {
        window.scrollTo(0, 0);
      };

    render() {
        return (
            <div>
                <NavBar search={this.props.search} />
        <div className="user-redirect"> 
              <div>You're currently not logged in, please click <span className="text" onClick={() => {
            this.props.history.push(`/signin`)}}> here</span> to sign in or sign up <span  className="text" onClick={() =>{
            this.props.history.push(`/signup`)}}> here.</span></div>
            </div>
        </div>
       )
    }        
}

export default withRouter(Redirect);