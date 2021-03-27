import React, { Component } from "react";
import Config from "../../config";
import "../../index.css";

class ConfirmPasswordReset extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      emailSent: false,
      emailNotFound: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const { name, value } = target;

    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    const emailData = {
      email: this.state.email,
    };

    fetch(Config.rpAPI + "/authentication/initiate_password_reset", {
      method: "POST",
      body: JSON.stringify(emailData),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 200) {
        this.setState({ emailSent: true });
        this.setState({ emailNotFound: false });
      } else if (response.status === 404) {
        this.setState({ emailNotFound: true });
      }
    });
    event.preventDefault();
  }

  render() {
    return (
      <React.Fragment>
        <div className="row justify-content-center">
          <h1 className="white_text">Confirm Password Reset</h1>
        </div>
        {this.state.emailSent ? (
          <React.Fragment>
            <h4 className="white_text">Email Sent!</h4>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="row justify-content-center">
              <h4 className="white_text">
                Enter your email to recieve a link to reset your password
              </h4>
            </div>
            {this.state.emailNotFound ? (
              <React.Fragment>
                <div className="row justify-content-center">
                  <h4 className="white_text">Email Not Found</h4>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment></React.Fragment>
            )}
            <div className="row justify-content-center">
              <div className="col-md-6">
                <form onSubmit={this.handleSubmit}>
                  <input
                    type="text"
                    name="email"
                    value={this.state.email}
                    className="form-control form_spacing"
                    onChange={this.handleChange}
                    placeholder="Email"
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

export default ConfirmPasswordReset;
