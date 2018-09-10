import React, { Component } from 'react'
import { Nav, Navbar, Popover, PopoverBody, PopoverHeader } from 'reactstrap'
import { withRouter } from 'react-router-dom'

class NavBar extends Component {
    constructor(props) {
        super(props);
     
        this.toggle = this.toggle.bind(this);
        this.state = {
          popoverOpen: false,
        };
      }
     
      toggle() {
        this.setState({
          popoverOpen: !this.state.popoverOpen,
        });
      }
    render() {
        return (
        <div>
        <Navbar  className="nav=container">
            <Nav className="ml-auto" navbar>
            <div>
            <input onClick={this.toggle} id="signInPop" style={{ width: '200px' }} className="serachbar__search" />
           <div>
           <button>Review </button>
           <button>Search </button>
           </div>
         <Popover style={{backgroundColor:'white'}}placement="bottom" isOpen={this.state.popoverOpen} target="signInPop" toggle={this.toggle}>
           <PopoverHeader>Popover Title</PopoverHeader>
           <PopoverBody>
             Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam
             venenatis vestibulum.
             <button onClick={this.toggle}>close</button>
           </PopoverBody>
         </Popover>
        </div>
        <div>
        <div onClick={()=>{this.props.history.push(`/signup`)}}className="SignIn-button">Sign Up</div>
        <div  onClick={()=>{this.props.history.push(`/signin`)}}className="SignUp-button">Sign In</div>
            </div>
            </Nav>
          
        </Navbar>
      </div>
        );
    }

}

export default withRouter(NavBar);
