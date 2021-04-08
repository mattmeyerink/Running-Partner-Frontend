import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import moment from "moment";
import Config from "../../config";
import "../../index.css";

/*
 * Class responsible for allowing the user to edit a general 
 * plan and add it to their account
 */
class AddPlan extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      planData: {},
      finalPlan: "",
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

    this.findFirstMonday = this.findFirstMonday.bind(this);
    this.convertToTable = this.convertToTable.bind(this);
    this.editTable = this.editTable.bind(this);
    this.saveTable = this.saveTable.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitPlan = this.submitPlan.bind(this);
  }
  
  componentDidMount() {
    // Set current page to allTraining Plans for the nav bar
    this.props.setCurrentPage("allTrainingPlans");

    // Set current path in local storage
    localStorage.setItem('currentPath', `/add_plan/${this.props.match.params.id}`);

    // Prepare headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Fetch the plan data from the API
    fetch(Config.rpAPI + `/training_plans/${this.props.match.params.id}`, {
      method: "GET",
      headers: myHeaders,
    })
      .then((result) => result.json())
      .then((data) =>
        this.setState({ planData: data, loading: false, finalPlan: data.plan })
      )
      .catch((error) => console.error(error));

    this.findFirstMonday();
  }

  /*
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

  /*
   * Converts the plan in state to an array that can be mapped to a table when rendered
   */
  convertToTable() {
    // Pull the plan data from state
    const plan = this.state.finalPlan;

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

  /*
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

  /*
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
      finalPlan: outputPlan,
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

  /*
   * Submit the custom plan to the database
   */  
  submitPlan() {
    // Retrive the user id from state
    const userID = this.props.userData.id;

    // Add dates to the final plan
    const currentStartDates = this.state.currentPlanDates;
    const finalPlan = this.state.finalPlan;
    const planArr = finalPlan.split("-");
    let output = "";
    for (let i = 0; i < planArr.length; i++) {
      output += currentStartDates[i] + "," + planArr[i] + "-";
    }
    // Remove trailing slash
    output = output.slice(0, -1);

    // Organize plan data into JSON object for fetch call
    const planData = {
      user_id: this.props.userData.id,
      plan: output,
      difficulty: this.state.planData.difficulty,
      race_name: this.state.planData.race_name,
      plan_length: this.state.planData.plan_length,
    };

    // Prepare headers for the reuest
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Send POST request to API. Set planSubmitted state to true if successful to redirect page to profile
    fetch(Config.rpAPI + `/training_plans/add_plan/${userID}`, {
      method: "POST",
      body: JSON.stringify(planData),
      headers: myHeaders,
    })
      .then((response) => {
        if (response.status === 201) {
          this.setState({ planSubmitted: true });
        }
      })
      .catch((error) => console.error(error));
  }

  render() {
    // Structure the plan data to be rendered in a table
    let planData = [];
    if (!this.state.loading) {
      planData = this.convertToTable();
    }

    return (
      <React.Fragment>
        {this.props.userAuthenticated ? (
          <React.Fragment>
            {this.state.loading ? (
              <React.Fragment>
                <div className="row justify-content-center loading_height">
                  <h1 className="white_text">Loading <Spinner animation="border" variant="light" /></h1>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {this.state.planSubmitted ? (
                  <React.Fragment>
                    <Redirect to="/personal_plan" />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className="row justify-content-center">
                      <h1 className="white_text">
                        {this.state.planData.race_name} -{" "}
                        {this.state.planData.difficulty}
                      </h1>
                    </div>
                    <div className="row justify-content-center">
                      <button
                        onClick={this.submitPlan}
                        className="btn btn-success form_spacing"
                      >
                        Submit Plan
                      </button>
                    </div>
                    <div className="row justify-content-center">
                      <h4 className="label_margin white_text">Start Date</h4>
                      <form>
                        <select
                          name="startDate"
                          value={this.state.startDate}
                          onChange={this.handleChange}
                        >
                          {this.state.possibleStartDates.map(
                            (possibleStartDate, index) => (
                              <React.Fragment key={index}>
                                <option value={possibleStartDate}>
                                  {possibleStartDate}
                                </option>
                              </React.Fragment>
                            )
                          )}
                        </select>
                      </form>
                    </div>
                    <div className="row justify-content-center">
                      <h3 className="white_text">Training Plan</h3>
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
                                          onClick={() =>
                                            this.editTable(index, week)
                                          }
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
                )}
              </React.Fragment>
            )}
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

export default AddPlan;
