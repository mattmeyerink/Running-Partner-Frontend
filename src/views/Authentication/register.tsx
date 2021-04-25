import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import StatesForm from "../../components/StatesForm";
import Config from "../../config";
import "../../index.css";

interface RegistrationProps {
  setCurrentPage(page: string): void;
};

interface RegistrationState {
  accountCreated?: boolean;
  warning?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  city?: string;
  state?: string;
  password?: string;
  password2?: string;
};

/**
 * Class that handles the registration page allowing new users to sign up
 */
class Registration extends Component<RegistrationProps, RegistrationState> {
  constructor(props: RegistrationProps) {
    super(props);

    this.state = {
      accountCreated: false,
      warning: "",
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      city: "",
      state: "",
      password: "",
      password2: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearWarning = this.clearWarning.bind(this);
  }

  componentDidMount() {
    // Set the users page to blank to unhighlight any nav bar tabs
    this.props.setCurrentPage("");

    // Set current path in local storage
    localStorage.setItem('currentPath', '/registration');
  }

  handleChange(event: any) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value });
  }

  handleSubmit(event: any) {
    // Ensure that all of the fields were filled out
    if (
      this.state.firstName === "" ||
      this.state.lastName === "" ||
      this.state.username === "" ||
      this.state.email === "" ||
      this.state.password === "" ||
      this.state.password2 === ""
    ) {
      this.setState({ warning: "Please fill in all form fields" });
      return;
    }

    // Make sure the passwords match each other
    if (this.state.password !== this.state.password2) {
      this.setState({ warning: "Passwords did not match. Try again!" });
      return;
    }

    // Package the registration data
    const registrationData = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      city: this.state.city,
      state: this.state.state,
      active_plan: -1,
    };

    // Push the registration data to the API
    fetch(Config.rpAPI + "/authentication/register", {
      method: "POST",
      body: JSON.stringify(registrationData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 201) {
        this.setState({ accountCreated: true });
      } else if (response.status === 409) {
        this.setState({
          warning: "Email already in use! Try a different one!",
        });
      }
    });

    event.preventDefault();
  }

  /*
   * Clear the registration warning from the screen
   */
  clearWarning() {
    this.setState({ warning: "" });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.accountCreated ? (
          <Redirect to="/login" />
        ) : (
          <React.Fragment>
            {this.state.warning === "" ? (
              <div className="row">
                <div className="col-md-4 offset-4 input_box">
                  <div className="row justify-content-center">
                    <h1>Register</h1>
                  </div>
                  <form onSubmit={this.handleSubmit}>
                    <input
                      type="text"
                      name="firstName"
                      value={this.state.firstName}
                      onChange={this.handleChange}
                      className="form-control form_spacing"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={this.state.lastName}
                      onChange={this.handleChange}
                      className="form-control form_spacing"
                      placeholder="Last Name"
                    />
                    <input
                      type="text"
                      name="username"
                      value={this.state.username}
                      onChange={this.handleChange}
                      className="form-control form_spacing"
                      placeholder="Username"
                    />
                    <input
                      type="text"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      className="form-control form_spacing"
                      placeholder="Email"
                    />
                    <input
                      type="text"
                      name="city"
                      value={this.state.city}
                      onChange={this.handleChange}
                      className="form-control form_spacing"
                      placeholder="City"
                    />
                    <select
                      name="state"
                      value={this.state.state}
                      onChange={this.handleChange}
                      className="form-control form_spacing"
                    >
                      <StatesForm />
                    </select>
                    <input
                      type="password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      className="form-control form_spacing"
                      placeholder="Password"
                    />
                    <input
                      type="password"
                      name="password2"
                      value={this.state.password2}
                      onChange={this.handleChange}
                      className="form-control form_spacing"
                      placeholder="Retype Password"
                    />
                    <input
                      type="submit"
                      className="btn btn-success form-control form_spacing"
                    />
                  </form>
                  <div className="row justify-content-center">
                    <strong>
                      Already have an account?
                      <Link to="/login"> Login!</Link>
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <React.Fragment>
                <div className="row justify-content-center">
                  <h1 className="text_shadow">{this.state.warning}</h1>
                </div>
                <div className="row justify-content-center">
                  <button
                    className="btn btn-warning"
                    onClick={this.clearWarning}
                  >
                    Return to Registration Page
                  </button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default Registration;