import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import StatesForm from "../../components/StatesForm";
import Config from "../../config";
import "../../index.css";

interface RegistrationProps {
  setCurrentPage(page: string): void;
}

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
  loading?: boolean;
}

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
      loading: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearWarning = this.clearWarning.bind(this);
    this.checkPasswordStrength = this.checkPasswordStrength.bind(this);
  }

  componentDidMount() {
    // Set the users page to blank to unhighlight any nav bar tabs
    this.props.setCurrentPage("");

    // Set current path in local storage
    localStorage.setItem("currentPath", "/registration");
  }

  handleChange(event: any) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value });
  }

  handleSubmit(event: any) {
    event.preventDefault();

    // Tell state api interaction has begun
    this.setState({ loading: true, warning: "" });

    // Ensure that all of the fields were filled out
    if (
      this.state.firstName === "" ||
      this.state.lastName === "" ||
      this.state.username === "" ||
      this.state.email === "" ||
      this.state.password === "" ||
      this.state.password2 === ""
    ) {
      this.setState({
        warning: "Please fill in all form fields",
        loading: false,
      });
      return;
    }

    // Ensure the password meets minimum strength requirements
    if (!this.checkPasswordStrength(this.state.password as string)) {
      this.setState({
        warning: "Passwords require an uppercase letter, lowercase letter, and a number",
        loading: false,
      });
      return;
    }

    // Make sure the passwords match each other
    if (this.state.password !== this.state.password2) {
      this.setState({
        warning: "Passwords did not match. Try again!",
        loading: false,
      });
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
        this.clearWarning();
      } else if (response.status === 409) {
        this.setState({
          warning: "Email already in use! Try a different one!",
        });
      }

      this.setState({ loading: false });
    });
  }

  /**
   * Returns if the password meets minimum strength requirements.
   * Currently password needs uppercase, lowercase, and a number.
   * @param password Represents the password to check strength of
   * @returns if password meets minimum strength requirements
   */
  checkPasswordStrength(password: string): boolean {
    // Conditions for acceptable password
    let upperCasePresent = false;
    let lowerCasePresent = false;
    let numberPresent = false;

    // Bounds for neccessary character types
    const capitalA = 65;
    const capitalZ = 90;
    const lowerA = 97;
    const lowerZ = 122;
    const lowerNum = 48;
    const upperNum = 57;

    for (let i = 0; i < password.length; i++) {
      const passwordChar = password.charCodeAt(i);

      // Check if the character is uppercase
      if (passwordChar >= capitalA && passwordChar <= capitalZ) {
        upperCasePresent = true;
        console.log('here upper');
      }

      // Check if character is lowercase
      else if (passwordChar >= lowerA && passwordChar <= lowerZ) {
        lowerCasePresent = true;
        console.log('here lower');
      }

      // Check if a digit is present
      else if (passwordChar >= lowerNum && passwordChar <= upperNum) {
        numberPresent = true;
        console.log('here number');
      }
    }

    return upperCasePresent && lowerCasePresent && numberPresent;
  }

  /**
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
                  <p className="warning_text">{this.state.warning}</p>
                  <button
                    type="submit"
                    className="btn btn-success form-control form_spacing"
                  >
                    Submit{" "}
                    {this.state.loading && (
                      <Spinner animation="border" variant="light" size="sm" />
                    )}
                  </button>
                </form>
                <div className="row justify-content-center">
                  <strong>
                    Already have an account?
                    <Link to="/login"> Login!</Link>
                  </strong>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default Registration;
