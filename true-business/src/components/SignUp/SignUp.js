import React, { Component } from 'react'
import { Link } from 'react-router-dom'


class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
            error: '',
            errorMessage: ''

        };
    }
createUser = event => {
    event.preventDefault();
    const user = {
        username: this.state.username,
        password: this.state.password,
        email: this.state.email,
    }
}

handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value});
}

    render() {
        return (
            <div className="col-sm-3">
            <div className='signup'>
                <h3>Sign up </h3>
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
                    <div className="form-group">
                        <input className="form-control" placeholder="email" name='email' type="email" value={this.state.email} onChange={this.handleInputChange} />
                    </div>
                    <div className='signup-button1'>
                        <button type="submit" className="signup-button2" onClick={this.createUser}>
                            Submit
                        </button>
                        <Link to="/">
                            <button className="home-button">
                                Home
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default SignUp;