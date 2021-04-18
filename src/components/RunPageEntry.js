import React, { Component } from "react";
import moment from "moment";
import StatesForm from "./StatesForm";
import Config from "../config";
import "../index.css";

/*
 * Run entry forms to allow runners to enter new runs
 * Component specifically for the my runs page
 */
class RunPageRunEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      distance: "",
      date: moment().format("YYYY-MM-DD"),
      city: this.props.city,
      state: this.props.state,
      notes: "",

      formError: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    // Prevent sending response if run is invalid
    if (this.state.distance === "" || this.state.distance <= 0) {
      event.preventDefault();
      this.setState({ formError: "Please enter a valid distance for the run!" });
      return;
    }

    // Package the run data into a JSON for API request
    const runData = {
      user_id: this.props.user_id,
      distance: this.state.distance,
      date: this.state.date,
      run_city: this.state.city,
      run_state: this.state.state,
      notes: this.state.notes,
    };

    // Prepare headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Send the run data to the API
    fetch(Config.rpAPI + "/runs/add_run", {
      method: "POST",
      body: JSON.stringify(runData),
      headers: myHeaders,
    })
      .then((response) => {
        // Reset the form fields if request was successful
        if (response.status === 201) {
          this.setState({
            distance: "",
            date: moment().format("YYYY-MM-DD"),
            city: this.props.city,
            state: this.props.state,
            notes: "",
            formError: "",
          });
          this.props.getRunData();
        }
      })
      .catch((error) => console.error(error));

    event.preventDefault();
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <div className="row form_spacing">
            <div className="col-md-6">
              <input
                type="number"
                name="distance"
                value={this.state.distance}
                onChange={this.handleChange}
                placeholder="Distance"
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <input
                type="date"
                name="date"
                value={this.state.date}
                onChange={this.handleChange}
                placeholder="Date (MM/DD/YYYY)"
                className="form-control"
              />
            </div>
          </div>
          <div className="row form_spacing">
            <div className="col-md-6">
              <input
                type="text"
                name="city"
                value={this.state.city}
                onChange={this.handleChange}
                placeholder="City"
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <select
                name="state"
                value={this.state.state}
                onChange={this.handleChange}
                className="form-control"
              >
                <StatesForm />
              </select>
            </div>
          </div>
          <textarea
            name="notes"
            value={this.state.notes}
            onChange={this.handleChange}
            placeholder="Notes"
            className="form-control form_spacing"
          />
          {this.state.formError === "" ? (
            <React.Fragment></React.Fragment>
          ) : (
            <p className="warning_text">{this.state.formError}</p>
          )}
          <input type="submit" className="btn btn-success form-control" />
        </form>
      </React.Fragment>
    );
  }
}

export default RunPageRunEntry;
