import React, { Component } from "react";
import "../../index.css";

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      confirmPassword: "",
      passwordReset: false,
      warning: null
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // Set the current page to blank for the nav bar
    this.props.setCurrentPage("");

    // Set current path in local storage
    localStorage.setItem('currentPath', `/reset_password/${this.props.match.params.id}`);
  }

  handleChange(event) {
    const target = event.target;
    const { name, value } = target;

    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    // Check if a password was input
    if (!this.state.password) {
      this.setState({ warning: "Please input a password" });
      return;
    }

    // Check if the passwords match
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ warning: "Passwords do not match" });
      return;
    } 

    // Package the data for the request
    const newPasswordData = {
      user_id: this.props.match.params.id,
      password: this.state.password
    };

    fetch(Config.rpAPI + "/authentication/reset_password", {
      method: "POST",
      body: JSON.stringify(newPasswordData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 200) {
        this.setState({ passwordReset: true });
      } else if (response.status === 404) {
        this.setState({
          warning: "There was an error locating your account",
        });
      }
    });
    
    event.preventDefault();
  }

  render() {
    return (
      <React.Fragment>
        <div className="row justify-content-center">
          <h1 className="white_text">Reset Password</h1>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6 background_color edit_profile_padding">
            <form>
              <input
                type="text"
                name="password"
                placeholder="Password"
                className="form-control form_spacing"
                value={this.state.password}
                onChange={this.handleChange}
              />
              <input
                type="text"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="form-control form_spacing"
                value={this.state.confirmPassword}
                onChange={this.handleChange}
              />
              <input type="submit" className="btn btn-success form-control" />
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ResetPassword;
