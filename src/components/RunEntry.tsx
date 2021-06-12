import React, { Component } from "react";
import moment from "moment";
import Card from "react-bootstrap/Card";
import StatesForm from "./StatesForm";
import { confirmValidCity } from "../utility/FormFieldUtilities";
import Config from "../config";
import "../index.css";

interface RunEntryProps {
  user_id: number;
  city: string;
  state: string;
  userData: any;
  isRunPage: boolean;
  getRunData(): void;
}

interface RunEntryState {
  distance?: any;
  date?: string;
  city?: string;
  state?: string;
  notes?: string;
  formError?: string;
}

/**
 * Run entry form to allow the runner to log a new run.
 * Located on the dashboard and the my runs page
 */
class RunEntry extends Component<RunEntryProps, RunEntryState> {
  constructor(props: RunEntryProps) {
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

  handleChange(event: any) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value });
  }

  handleSubmit(event: any) {
    event.preventDefault();

    // Prevent sending response if run is invalid
    if (this.state.distance === "" || this.state.distance <= 0) {
      event.preventDefault();
      this.setState({
        formError: "Please enter a valid distance for the run!",
      });
      return;
    }

    // Make sure the user entered a valid city
    if (
      !confirmValidCity(this.state.city as string, this.state.state as string)
    ) {
      this.setState({
        formError: "City not found",
      });
      return;
    }

    // Create json object to send in POST request
    const runData = {
      user_id: this.props.user_id,
      distance: this.state.distance,
      date: this.state.date,
      run_city: this.state.city,
      run_state: this.state.state,
      notes: this.state.notes,
    };

    // Prepare the headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Send POST request to create run in the db
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
          // Signal to refresh runs if this is the all runs page
          if (this.props.isRunPage) {
            this.props.getRunData();
          }
        }
      })
      .catch((error) => console.error(error));
  }

  render() {
    return (
      <Card className="text-center">
        <Card.Header>
          <h3 className="text-left">Enter a Run</h3>
        </Card.Header>

        <Card.Body>
          <form onSubmit={this.handleSubmit}>
            <input
              type="number"
              name="distance"
              value={this.state.distance}
              onChange={this.handleChange}
              placeholder="Distance"
              className="form_spacing form-control"
            />
            <input
              type="date"
              name="date"
              value={this.state.date}
              onChange={this.handleChange}
              placeholder="Date (MM/DD/YYYY)"
              className="form_spacing form-control"
            />
            <input
              type="text"
              name="city"
              value={this.state.city}
              onChange={this.handleChange}
              placeholder="City"
              className="form_spacing form-control"
            />
            <select
              name="state"
              value={this.state.state}
              onChange={this.handleChange}
              className="form_spacing form-control"
            >
              <StatesForm />
            </select>
            <textarea
              name="notes"
              value={this.state.notes}
              onChange={this.handleChange}
              placeholder="Notes"
              className="form_spacing form-control"
            />
            <p className="warning_text">{this.state.formError}</p>
            <button
              type="submit"
              className="form-control btn btn-success form_spacing"
            >
              Submit
            </button>
          </form>
        </Card.Body>
      </Card>
    );
  }
}

export default RunEntry;
