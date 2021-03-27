import React, { Component } from "react";
import "../../index.css";

class ConfirmPasswordReset extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const { name, value } = target;

    this.setState({ [name]: value });
  }

  handleSubmit() {
    console.log("whats up");
  }

  render() {
    return (
      <React.Fragment>
        <div className="row justify-content-center">
          <h1 className="white_text">Confirm Password Reset</h1>
        </div>
        <div className="row justify-content-center">
          <h4 className="white_text">
            Enter your email to recieve a link to reset your password
          </h4>
        </div>
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
              <input type="submit" className="btn btn-success form-control" />
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ConfirmPasswordReset;
