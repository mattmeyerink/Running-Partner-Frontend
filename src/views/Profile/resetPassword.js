import React, { Component } from "react";
import "../../index.css";

class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      confirmPassword: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const { name, value } = target;

    this.setState({ [name]: value });
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
