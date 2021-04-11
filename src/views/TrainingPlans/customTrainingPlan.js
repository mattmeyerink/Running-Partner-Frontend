import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import "../../index.css";

class CustomPlan extends Component {
  constructor() {
    super();
    this.state = {
      numberOfWeeks: 5,
      trainingPlanString:
        "0,0,0,0,0,0,0-0,0,0,0,0,0,0-0,0,0,0,0,0,0-0,0,0,0,0,0,0-0,0,0,0,0,0,0-",
    };

    this.changeNumberOfWeeks = this.changeNumberOfWeeks.bind(this);
    this.convertToTable = this.convertToTable.bind(this);
  }

  /*
   * Method to change the number of weeks of the plan
   */
  changeNumberOfWeeks(event) {
    // Gather determine which button was pressed
    const action = event.target.name;

    // Adjust the nubmer of weeks in state accordingly
    this.setState((previousState) => {
      if (action === "plus") {
        return { numberOfWeeks: previousState.numberOfWeeks + 1 };
      } else {
        return { numberOfWeeks: previousState.numberOfWeeks - 1 };
      }
    });
  }

  /*
   * Converts the plan in state to an array that can be mapped to a table when rendered
   */
  convertToTable() {
    // Pull the plan data from state
    const plan = this.state.trainingPlanString;

    // Split the string into weeks with the deliniating - char
    const weeks = plan.split("-");

    // Create a matrix of all of the runs
    const planOutput = [];
    for (let i = 0; i < weeks.length; i++) {
      // Split the week into individual run days
      const days = weeks[i].split(",");

      // Create the array for the week and calculate week mileage total
      const weekOutput = [];
      let total = 0;
      for (let j = 0; j < days.length; j++) {
        weekOutput.push(days[j]);
        total += parseFloat(days[j]);
      }

      // Push the weeks runs onto the matrix
      weekOutput.push(total);
      planOutput.push(weekOutput);
    }

    return planOutput;
  }

  render() {
    // Structure the plan data to be rendered in a table
    const planData = this.convertToTable();

    return (
      <React.Fragment>
        {this.props.userAuthenticated ? (
          <React.Fragment>
            <div className="row justify-content-center">
              <h1 className="white_text">Custom Training Plan</h1>
            </div>
            <div className="row justify-content-center">
              <h3 className="white_text custom_plan_button">Number of Weeks</h3>
              <button
                onClick={this.changeNumberOfWeeks}
                name="plus"
                className="btn btn-success custom_plan_button"
              >
                <b>+</b>
              </button>
              <button
                onClick={this.changeNumberOfWeeks}
                name="minus"
                className="btn btn-success custom_plan_button"
              >
                <b>-</b>
              </button>
            </div>
            <div className="row justify-content-center">
              <h3 className="white_text">{this.state.numberOfWeeks}</h3>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Redirect to="/login" />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default CustomPlan;
