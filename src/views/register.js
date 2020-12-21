import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import '../index.css';

class Registration extends Component {
    constructor() {
        super();

        this.state = {
            accountCreated: false,
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            password2:"" 
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }

    handleSubmit(event) {
        // Check if both passwords are the same
        if (this.state.password !== this.state.password2) {
            // TODO flash passwords do not match pin. 
            console.log("The passwords do not match");
        }
        const registrationData = {
            "first_name": this.state.firstName,
            "last_name": this.state.lastName,
            "username": this.state.username,
            "email": this.state.email,
            "password": this.state.password
        }

        fetch("http://127.0.0.1:5000/authentication/register", {
            method: "POST",
            body: JSON.stringify(registrationData),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((response) => {
            if (response.status === 201) {
                // TODO flash success pin. Reroute user to the login screen
                this.setState({accountCreated: true});
            }
            else if (response.status === 409) {
                // TODO flash email already in use pin
                console.log("That email is already in use");
            }
        })

        event.preventDefault();
    }

    render() {
        return (
            <React.Fragment>
                {this.state.accountCreated 
                ? 
                <Redirect to="/login" /> 
                : 
                <div className="row">
                    <div className="col-md-4 offset-4 border border-dark input_box">
                        <div className="row justify-content-center">
                            <h1>Register</h1>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} className="form-control form_spacing" placeholder="First Name" />
                            <input type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} className="form-control form_spacing" placeholder="Last Name" />
                            <input type="text" name="username" value={this.state.username} onChange={this.handleChange} className="form-control form_spacing" placeholder="Username" />
                            <input type="text" name="email" value={this.state.email} onChange={this.handleChange} className="form-control form_spacing" placeholder="Email" />
                            <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="form-control form_spacing" placeholder="Password" />
                            <input type="password" name="password2" value={this.state.password2} onChange={this.handleChange} className="form-control form_spacing" placeholder="Retype Password" />
                            <input type="submit" className="btn btn-success form-control"/>
                        </form>
                    </div>
                </div>
                }
            </React.Fragment>
            
            
        )
    }
}

export default Registration;
