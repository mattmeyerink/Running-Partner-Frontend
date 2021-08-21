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
  showAlertMessage(variant: string, header: string, message: string): void;
}

interface RunEntryState {
  distance?: any;
  date?: string;
  city?: string;
  state?: string;
  notes?: string;
  formError?: string;
  activePlanData?: any;
  activePlanExists?: boolean;
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
      activePlanData: {},
      activePlanExists: false,

      formError: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // Prepare headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Only send the request of the person has an active plan set
    if (this.props.userData.active_plan !== -1) {
      fetch(
        Config.rpAPI +
          `/training_plans/custom_plan/${this.props.userData.active_plan}`,
        {
          method: "GET",
          headers: myHeaders,
        }
      )
        .then((response) => response.json())
        .then((data) =>
          this.setState({
            activePlanData: data,
            activePlanExists: true,
          })
        )
        .catch((error) => console.error(error));
    }
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
          // Trigger successful alert
          this.props.showAlertMessage('success', 'Run Successfully Saved', 'Congratulations on you latest adventure! We\'ve got your run in the books!');
        }
      })
      .catch((error) => console.error(error));
  }

  /**
   * Determines if the run satisfied the distance specified in the user's active plan
   * @param date Date the run occured on
   * @param runDistance Distance covered in the run
   * @returns If the run satisfied a training plan run
   */
  didRunMeetPlanDistance(date: string, runDistance: number): boolean {
    // Pull the active plan from state and create a week by week array
    const activePlan = this.state.activePlanData.plan;
    const activePlanArr = activePlan.split("-");

    // Get the start date of the first week and the last week
    const firstWeekStart = activePlanArr[0].split(",")[0];
    const lastWeekStart =
      activePlanArr[activePlanArr.length - 1].split(",")[0];

    // Split dates in array to use in creating moment objects
    const firstWeekStartArr = firstWeekStart.split("/");
    const lastWeekStartArr = lastWeekStart.split("/");

    // Create moment objects with first and last week moments
    const firstWeekStartMoment = moment({
      year: parseInt(firstWeekStartArr[2]),
      month: firstWeekStartArr[0] - 1,
      day: parseInt(firstWeekStartArr[1]),
    });
    firstWeekStartMoment.subtract(1, "days");
    const lastWeekStartMoment = moment({
      year: parseInt(lastWeekStartArr[2]),
      month: lastWeekStartArr[0] - 1,
      day: parseInt(lastWeekStartArr[1]),
    });
    lastWeekStartMoment.add(7, "days");

    // Create a moment with the passed in run date
    const dateMoment = moment(date, "YYYY-MM-DD");

    // Check if today is within the range of the active plan dates
    if (
      dateMoment.isAfter(firstWeekStartMoment) &&
      dateMoment.isBefore(lastWeekStartMoment)
    ) {
      for (let i = 0; i < activePlanArr.length; i++) {
        // Split up the string of the current week
        const currentWeekArr = activePlanArr[i].split(",");

        // Gather the start date for the week and put it into an array
        const weekStartDate = currentWeekArr[0];
        const weekStartDateArr = weekStartDate.split("/");

        // Create moments for the start of the week and for the end of the week
        const weekStartDateMoment = moment({
          year: parseInt(weekStartDateArr[2]),
          month: weekStartDateArr[0] - 1,
          day: weekStartDateArr[1],
        });
        weekStartDateMoment.subtract(1, "days");
        const weekEndDateMoment = moment({
          year: parseInt(weekStartDateArr[2]),
          month: weekStartDateArr[0] - 1,
          day: parseInt(weekStartDateArr[1]),
        });
        weekEndDateMoment.add(7, "days");

        // Check if todays run is within this week
        if (
          moment().isAfter(weekStartDateMoment) &&
          moment().isBefore(weekEndDateMoment)
        ) {
          weekStartDateMoment.add(1, "days");

          // Possible easier way to do this. Determine which day of the week today is and pull that
          // value from the plan array
          let j = 1;
          while (j < 8) {
            // Pull the ints for the current day, month, year
            const currentDay = moment().day();
            const currentMonth = moment().month();
            const currentYear = moment().year();

            // Pull the ints for the current day in the plan's date, month, year
            const planDay = weekStartDateMoment.day();
            const planMonth = weekStartDateMoment.month();
            const planYear = weekStartDateMoment.year();

            if (
              currentDay === planDay &&
              currentMonth === planMonth &&
              currentYear === planYear
            ) {
              return runDistance >= currentWeekArr[j];
            }
            weekStartDateMoment.add(1, "days");
            j++;
          }
        }
      }
    }

    return false;
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
