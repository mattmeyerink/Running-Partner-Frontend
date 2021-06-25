import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import moment from "moment";
import Config from "../../config";
import "../../index.css";
import { getMonthDayFormat } from "../../utility/DateFormatters";
import { Row } from "react-bootstrap";

interface AddPlanProps {
  setCurrentPage(page: string): void;
  userData: any;
  match: any;
  userAuthenticated: boolean;
}

interface AddPlanState {
  loading?: boolean;
  planData?: any;
  finalPlan?: string;
  inEditMode?: any;
  mondayEdit?: any;
  tuesdayEdit?: any;
  wednesdayEdit?: any;
  thursdayEdit?: any;
  fridayEdit?: any;
  saturdayEdit?: any;
  sundayEdit?: any;
  totalEdit?: any;
  planName?: string;

  planSubmitted?: boolean;

  possibleStartDates?: any;
  currentPlanDates?: any;
  next2YearsDates?: any;
  startDate?: any;
}

/**
 * Class responsible for allowing the user to edit a general
 * plan and add it to their account
 */
class AddPlan extends Component<AddPlanProps, AddPlanState> {
  constructor(props: AddPlanProps) {
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
      planName: "",

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
    localStorage.setItem(
      "currentPath",
      `/add_plan/${this.props.match.params.id}`
    );

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
      .then((data) => {
        this.setState({ planData: data, loading: false, finalPlan: data.plan, planName: "My AWESOME " + data.race_name + " plan" });
      })
      .catch((error) => console.error(error));

    this.findFirstMonday();
  }

  /**
   * Assign the moment object for the first monday the plan can start on.
   * The earliest a plan can start is one month prior to the current day.
   */
  findFirstMonday() {
    // Gather the current datetime object. Move to next day until monday is found
    let currentDay = moment();
    currentDay = currentDay.subtract(1, "months");

    // Find the next Monday to start from
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
      possibleStartDates: startDates.slice(0, 56),
      startDate: startDates[5],
      currentPlanDates: startDates.slice(5),
      next2YearsDates: startDates,
    });
  }

  /**
   * Converts the plan in state to an array that can be mapped to a table when rendered
   */
  convertToTable() {
    // Pull the plan data from state
    const plan: string = this.state.finalPlan as string;

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
  editTable(rowKey: number, week: any) {
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

  /**
   * Saves any edits to the table to state
   * @param index Represents the week that was edited/saved
   * @param planData
   */
  saveTable(index: number, planData: any) {
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

  handleChange(event: any) {
    // Gather change event variables
    const target = event.target;
    const name = target.name;
    const value = target.value;

    const editDayNames = [
      "mondayEdit",
      "tuesdayEdit",
      "wednesdayEdit",
      "thursdayEdit",
      "fridayEdit",
      "saturdayEdit",
      "sundayEdit",
    ];

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

    // Don't let any week day be edited to a negative number
    else if (editDayNames.includes(name) && value < 0) {
      return;
    }

    // Changed the specified state
    this.setState({ [name]: value });
  }

  /**
   * Submit the custom plan to the database
   */
  submitPlan() {
    // Make sure the plan name field is not blank
    if (this.state.planName === '') {
      this.setState({ planName: "My AWESOME " + this.state.planData.race_name + " plan"})
    }

    // Retrive the user id from state
    const userID = this.props.userData.id;

    // Add dates to the final plan
    const currentStartDates = this.state.currentPlanDates;
    const finalPlan: string = this.state.finalPlan as string;
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
      race_name: this.state.planName,
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
    let planData: any = [];
    if (!this.state.loading) {
      planData = this.convertToTable();
    }

    const planEndDateMonday = this.state.currentPlanDates[this.state.planData.plan_length - 1];
    const planEndDate = moment(planEndDateMonday).add(6, 'days').format("dddd MMMM Do, YYYY");

    return (
      <React.Fragment>
        {this.props.userAuthenticated ? (
          <React.Fragment>
            {this.state.loading ? (
              <React.Fragment>
                <div className="row justify-content-center loading_height">
                  <h1 className="white_text">
                    Loading <Spinner animation="border" variant="light" />
                  </h1>
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
                    <Row className="justify-content-center">
                      <h4 className="white_text aligning_text_height">
                        This is your AWESOME plan currently named... 
                      </h4>
                    </Row>
                    <Row className="justify-content-center">
                      <input
                          type="text"
                          name="planName"
                          value={this.state.planName}
                          onChange={this.handleChange}
                          className="form-control custom_plan_button restrict_width"
                          placeholder="Plan Name"
                        />
                    </Row>
                    <Row className="justify-content-center">
                      <h4 className="white_text aligning_text_height">
                        Your plan starts on 
                      </h4>
                      <form>
                        <select
                          name="startDate"
                          value={this.state.startDate}
                          onChange={this.handleChange}
                          className="form-control custom_plan_button"
                        >
                          {this.state.possibleStartDates.map(
                            (possibleStartDate: string, index: number) => (
                              <React.Fragment key={index}>
                                <option value={possibleStartDate}>
                                  {possibleStartDate}
                                </option>
                              </React.Fragment>
                            )
                          )}
                        </select>
                      </form>
                    </Row>
                    <Row className="justify-content-center">
                      <h4 className="white_text">
                        Your plan ends on <b>{planEndDate}</b>
                      </h4>
                    </Row>
                    <Row className="justify-content-center">
                      <Link
                        to={`/training_plans/${this.props.match.params.id}`}
                        className="btn btn-warning custom_plan_button">
                          Back to Outline
                      </Link>
                      <button
                        onClick={this.submitPlan}
                        className="btn btn-success custom_plan_button"
                      >
                        Submit Plan
                      </button>
                    </Row>
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
                            {planData.map((week: any, index: number) => (
                              <React.Fragment key={index}>
                                <tr>
                                  <td>
                                    <b>{getMonthDayFormat(this.state.currentPlanDates[index])}</b>
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
