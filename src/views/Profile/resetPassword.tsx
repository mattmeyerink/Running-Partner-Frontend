import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Config from "../../config";
import checkPasswordStrength from "../../utility/checkPasswordStrength";
import "../../index.css";

interface ResetPasswordProps {
  setCurrentPage(page: string): void;
  match: any;
}

interface ResetPasswordState {
  password?: string;
  confirmPassword?: string;
  passwordReset?: boolean;
  warning?: string;
}

/**
 * Class that holds the form that resets the user's password on submit
 */
class ResetPassword extends Component<ResetPasswordProps, ResetPasswordState> {
  constructor(props: ResetPasswordProps) {
    super(props);

    this.state = {
      password: "",
      confirmPassword: "",
      passwordReset: false,
      warning: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // Set the current page to blank for the nav bar
    this.props.setCurrentPage("");

    // Set current path in local storage
    localStorage.setItem(
      "currentPath",
      `/reset_password/${this.props.match.params.id}`
    );
  }

  handleChange(event: any) {
    const target = event.target;
    const { name, value } = target;

    this.setState({ [name]: value });
  }

  handleSubmit(event: any) {
    // Check to make a password was input
    if (!this.state.password) {
      this.setState({ warning: "Please input a password" });
    }

    // Check the password strength
    if (!checkPasswordStrength(this.state.password as string)) {
      this.setState({ warning: "Passwords require an uppercase letter, lowercase letter, and a number"});
    }

    // Check that the two passwords match
    else if (this.state.password !== this.state.confirmPassword) {
      this.setState({ warning: "Passwords do not match" });
    } else {
      // Package the data for the request
      const newPasswordData = {
        user_id: this.props.match.params.id,
        password: this.state.password,
      };

      // Send the new passwords to the API
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
    }

    event.preventDefault();
  }

  render() {
    return (
      <React.Fragment>
        {this.state.passwordReset ? (
          <Redirect to="/login" />
        ) : (
          <React.Fragment>
            <div className="row justify-content-center">
              <h1 className="white_text">Reset Password</h1>
            </div>
            {this.state.warning !== null ? (
              <div className="row justify-content-center">
                <h3 className="white_text">{this.state.warning}</h3>
              </div>
            ) : (
              <React.Fragment></React.Fragment>
            )}
            <div className="row justify-content-center">
              <div className="col-md-6 background_color edit_profile_padding">
                <form onSubmit={this.handleSubmit}>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-control form_spacing"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="form-control form_spacing"
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                  />
                  <input
                    type="submit"
                    className="btn btn-success form-control"
                  />
                </form>
              </div>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default ResetPassword;
