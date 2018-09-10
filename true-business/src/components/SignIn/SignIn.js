import React, { Component } from 'react';
import axio from 'axios';
import { Link } from 'react-router-dom'


class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
            errorMessage: ''
            
        };
    }

    handleInputChange = event => {
        this.setState({ [event.target.name]: event.target.value});
    }

    render() {

        return (
            <div className="App">
                    <h2> Login </h2>
                    <div className={this.state.error ? "error" : "hidden"}>
                        {this.state.errorMessage}
                    </div>
                    <div className='signup-form'>
                        <div className="form-group">
                            <input className="form-control" placeholder="Username" name='username' type="text" value={this.state.username} onChange={this.handleInputChange} />
                        </div>
                        <div className="form-group">
                            <input className="form-control" placeholder="Password" name='password' type="password" value={this.state.password} onChange={this.handleInputChange} />
                        </div>
                        <div className='signup-buts'>
                            <button type="submit" className="signup-button" onClick={this.login}>
                                Login
                            </button>
                            <Link to="/">
                                <button className="home-button">
                                    Home
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
        )

    }
}

export default SignIn;