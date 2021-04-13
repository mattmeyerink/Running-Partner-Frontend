import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import moment from "moment";
import "../../index.css";

class CustomPlan extends Component {
  constructor() {
    super();
    this.state = {
      numberOfWeeks: 5,
      trainingPlanString:
        "0,0,0,0,0,0,0-0,0,0,0,0,0,0-0,0,0,0,0,0,0-0,0,0,0,0,0,0-0,0,0,0,0,0,0",

      inEditMode: {
        status: false,
        rowKey: null,
        rowValues: null,
      },

      mondayEdit: null,
      tuesdayEdit: null,
      wednesdayEdit: null,
      thursdayEdit: null,
      fridayEdit: null,
      saturdayEdit: null,
      sundayEdit: null,
      totalEdit: null,

      planSubmitted: false,

      possibleStartDates: [],
      currentPlanDates: [],
      next2YearsDates: [],
      startDate: null,
    };

    this.changeNumberOfWeeks = this.changeNumberOfWeeks.bind(this);
    this.convertToTable = this.convertToTable.bind(this);
    this.findFirstMonday = this.findFirstMonday.bind(this);
    this.editTable = this.editTable.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // Set current page to allTraining Plans for the nav bar
    this.props.setCurrentPage("allTrainingPlans");

    this.findFirstMonday();
  }

  /**
   * Assign the moment object for the next monday in state
   */
  findFirstMonday() {
    // Gather the current datetime object. Move to next day until monday is found
    let currentDay = moment();
    while (currentDay.format("dddd") !== "Monday") {
      currentDay = currentDay.add(1, "days");
    }

    // Store the next 2 years of mondays
    let startDates = [];
    for (let i = 0; i < 104; i++) {
      startDates.push(currentDay.format("L"));
      currentDay = currentDay.add(7, "days");
    }

    // Set date arrays/values in state
    this.setState({
      possibleStartDates: startDates.slice(0, 52),
      startDate: startDates[0],
      currentPlanDates: startDates,
      next2YearsDates: startDates,
    });
  }

  /**
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

  /**
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

  /**
   * Enter into edit mode for a specific row on the plan table
   * @param rowKey represents the week of the plan being edited
   * @param week data to display to initialize in edit form
   */
  editTable(rowKey, week) {
    // Set the state to edit mode and set which week being edited
    this.setState({
      inEditMode: {
        status: true,
        rowKey: rowKey,
      },

      // Initialize each run edit value to the appropriate weeks runs
      mondayEdit: week[0],
      tuesdayEdit: week[1],
      wednesdayEdit: week[2],
      thursdayEdit: week[3],
      fridayEdit: week[4],
      saturdayEdit: week[5],
      sundayEdit: week[6],
      totalEdit: week[7],
    });
  }

  /**`
   * Saves any edits to the table to state
   * @param index Represents the week that was edited/saved
   * @param planData 
   */
  saveTable(index, planData) {
    // Push the edited values from the table into the planData
    planData[index] = [
      this.state.mondayEdit,
      this.state.tuesdayEdit,
      this.state.wednesdayEdit,
      this.state.thursdayEdit,
      this.state.fridayEdit,
      this.state.saturdayEdit,
      this.state.sundayEdit,
      this.state.totalEdit,
    ];

    // Stringify the matrix of plan data
    let outputPlan = "";
    for (let i = 0; i < planData.length; i++) {
      for (let j = 0; j < planData[0].length - 1; j++) {
        // Add the value without a comma unless it is the last value.
        if (j !== planData[0].length - 2) {
          outputPlan += planData[i][j] + ",";
        }
        // Add the dash to signify the end of the week
        else {
          outputPlan += planData[i][j] + "-";
        }
      }
    }

    // Remove the trailing dash from the plan
    outputPlan = outputPlan.slice(0, -1);

    // Reset state to be out of edit mode
    this.setState({
      inEditMode: {
        status: false,
        rowKey: null,
        mondayEdit: null,
        tuesdayEdit: null,
        wednesdayEdit: null,
        thursdayEdit: null,
        fridayEdit: null,
        saturdayEdit: null,
        sundayEdit: null,
        totalEdit: null,
      },
      trainingPlanString: outputPlan,
    });
  }

  handleChange(event) {
    // Gather change event variables
    const target = event.target;
    const name = target.name;
    const value = target.value;

    // Set the currentPlanDates array to appropriate values if start date changed
    if (name === "startDate") {
      const next2YearsDates = this.state.next2YearsDates;
      const possibleStartDates = this.state.possibleStartDates;
      let dateIndex;
      for (let i = 0; i < possibleStartDates.length; i++) {
        if (value === possibleStartDates[i]) {
          dateIndex = i;
        }
      }
      this.setState({ currentPlanDates: next2YearsDates.slice(dateIndex) });
    }

    // Changed the specified state
    this.setState({ [name]: value });
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
            <div className="row justify-content-center">
              <div className="col-md-10">
                <table className="table background_color">
                  <tbody>
                    <tr>
                      <th>Week</th>
                      <th>Monday</th>
                      <th>Tuesday</th>
                      <th>Wednesday</th>
                      <th>Thursday</th>
                      <th>Friday</th>
                      <th>Saturday</th>
                      <th>Sunday</th>
                      <th>Total</th>
                    </tr>
                    {planData.map((week, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td>
                            <b>{this.state.currentPlanDates[index]}</b>
                          </td>
                          <td>
                            {this.state.inEditMode.status &&
                            this.state.inEditMode.rowKey === index ? (
                              <input
                                className="training_col"
                                type="number"
                                name="mondayEdit"
                                value={this.state.mondayEdit}
                                onChange={this.handleChange}
                              ></input>
                            ) : (
                              <React.Fragment>{week[0]}</React.Fragment>
                            )}
                          </td>
                          <td>
                            {this.state.inEditMode.status &&
                            this.state.inEditMode.rowKey === index ? (
                              <input
                                className="training_col"
                                type="number"
                                name="tuesdayEdit"
                                value={this.state.tuesdayEdit}
                                onChange={this.handleChange}
                              ></input>
                            ) : (
                              <React.Fragment>{week[1]}</React.Fragment>
                            )}
                          </td>
                          <td>
                            {this.state.inEditMode.status &&
                            this.state.inEditMode.rowKey === index ? (
                              <input
                                className="training_col"
                                type="number"
                                name="wednesdayEdit"
                                value={this.state.wednesdayEdit}
                                onChange={this.handleChange}
                              ></input>
                            ) : (
                              <React.Fragment>{week[2]}</React.Fragment>
                            )}
                          </td>
                          <td>
                            {this.state.inEditMode.status &&
                            this.state.inEditMode.rowKey === index ? (
                              <input
                                className="training_col"
                                type="number"
                                name="thursdayEdit"
                                value={this.state.thursdayEdit}
                                onChange={this.handleChange}
                              ></input>
                            ) : (
                              <React.Fragment>{week[3]}</React.Fragment>
                            )}
                          </td>
                          <td>
                            {this.state.inEditMode.status &&
                            this.state.inEditMode.rowKey === index ? (
                              <input
                                className="training_col"
                                type="number"
                                name="fridayEdit"
                                value={this.state.fridayEdit}
                                onChange={this.handleChange}
                              ></input>
                            ) : (
                              <React.Fragment>{week[4]}</React.Fragment>
                            )}
                          </td>
                          <td>
                            {this.state.inEditMode.status &&
                            this.state.inEditMode.rowKey === index ? (
                              <input
                                className="training_col"
                                type="number"
                                name="saturdayEdit"
                                value={this.state.saturdayEdit}
                                onChange={this.handleChange}
                              ></input>
                            ) : (
                              <React.Fragment>{week[5]}</React.Fragment>
                            )}
                          </td>
                          <td>
                            {this.state.inEditMode.status &&
                            this.state.inEditMode.rowKey === index ? (
                              <input
                                className="training_col"
                                type="number"
                                name="sundayEdit"
                                value={this.state.sundayEdit}
                                onChange={this.handleChange}
                              ></input>
                            ) : (
                              <React.Fragment>{week[6]}</React.Fragment>
                            )}
                          </td>
                          <td>
                            {this.state.inEditMode.status &&
                            this.state.inEditMode.rowKey === index ? (
                              <React.Fragment>
                                {this.state.totalEdit.toFixed(1)}
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                {week[7].toFixed(1)}
                              </React.Fragment>
                            )}
                          </td>
                          <td>
                            {this.state.inEditMode.status &&
                            this.state.inEditMode.rowKey === index ? (
                              <React.Fragment>
                                <button
                                  className="btn btn-success"
                                  onClick={() =>
                                    this.saveTable(index, planData)
                                  }
                                >
                                  Save
                                </button>
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <button
                                  className="btn btn-warning"
                                  onClick={() => this.editTable(index, week)}
                                >
                                  Edit
                                </button>
                              </React.Fragment>
                            )}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
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
