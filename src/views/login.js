import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import '../index.css';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            warning: "",
            email: "",
            password: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearWarning = this.clearWarning.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
    
        this.setState({[name]: value});
    }

    handleSubmit(event) {

        // Determine if a form field was left blank
        if (this.state.email === "" || this.state.password === "") {
            this.setState({warning: "Please fill in all login credentials"})
            return;
        }

        // Prepare JSON to submit form data to API
        const loginData = {
            "email": this.state.email,
            "password": this.state.password
        }

        // Fetch request to authentication section of API
        fetch("http://127.0.0.1:5000/authentication/login", {
            method: "POST",
            body: JSON.stringify(loginData),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((response) => {
            if (response.status === 401) {
                this.setState({warning: "Invalid Email or Password"})
            }
            return response.json()
        })
        .then(data => {
            if (data !== {}){
                this.props.login(data);
        }})
        .catch(error => console.error(error))

        event.preventDefault();
    }

    clearWarning() {
        this.setState({warning: ""})
    }

    render() {
        return (
            <React.Fragment>
                {this.props.userAuthenticated
                ? 
                <Redirect to="/" /> 
                :
                <React.Fragment>
                    {this.state.warning === "" ?
                    <div className="row">
                        <div className="col-md-4 offset-4 border border-dark login_input_box">
                            <div className="row justify-content-center">
                                <h1>Login</h1>
                            </div>
                            <form onSubmit={this.handleSubmit}>
                                <input 
                                    type="text" 
                                    name="email"
                                    onChange={this.handleChange}
                                    value={this.state.username}
                                    placeholder="Email" 
                                    className="form-control form_spacing"
                                />
                                <input 
                                    type="password" 
                                    name="password"
                                    onChange={this.handleChange}
                                    value={this.state.password}
                                    placeholder="Password" 
                                    className="form-control form_spacing"
                                />
                                <input type="submit" className="form-control btn btn-success" />
                            </form>
                            <strong>
                                Not signed up yet?
                                <Link to="/registration"> Create an account!</Link>
                            </strong>
                        </div>
                    </div>
                    :
                    <React.Fragment>
                        <div className="row justify-content-center">
                            <h1>{this.state.warning}</h1>
                        </div>
                        <div className="row justify-content-center">
                        <button className="btn btn-warning" onClick={this.clearWarning}>
                                Return to Login Page
                        </button>
                        </div>
                    </React.Fragment>
                    }
                </React.Fragment>
                }
            </React.Fragment>
            
        )
    }
}

export default Login;
