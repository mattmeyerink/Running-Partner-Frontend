import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Config from "../../config";
import "../../index.css";
import { getMonthDayFormat } from "../../utility/DateFormatters";

interface EditPlanProps {
  setCurrentPage(page: string): void;
  userData: any;
  userAuthenticated: boolean;
  match: any;
}

interface EditPlanState {
  loading?: boolean;
  planData?: any;
  finalPlan?: string;
  inEditMode?: any

  startDateEdit?: any;
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
}

/**
 * This class is in charge of the page that allows the user to edit a plan
 * Already added to their account.
 */
class EditPlan extends Component<EditPlanProps, EditPlanState> {
  constructor(props: EditPlanProps) {
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

      startDateEdit: null,
      mondayEdit: null,
      tuesdayEdit: null,
      wednesdayEdit: null,
      thursdayEdit: null,
      fridayEdit: null,
      saturdayEdit: null,
      sundayEdit: null,
      totalEdit: null,
      planName: "",

      planSubmitted: false,
    };

    this.convertToTable = this.convertToTable.bind(this);
    this.editTable = this.editTable.bind(this);
    this.saveTable = this.saveTable.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitPlan = this.submitPlan.bind(this);
  }

  componentDidMount() {
    // Set the current page to myTrainingPlans for the nav bar
    this.props.setCurrentPage("myTrainingPlans");

    // Create the headers for the API request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Send for the plan data and save it in state.
    fetch(
      Config.rpAPI +
        `/training_plans/custom_plan/${this.props.match.params.id}`,
      {
        method: "GET",
        headers: myHeaders,
      }
    )
      .then((result) => result.json())
      .then((data) =>
        this.setState({ planData: data, loading: false, finalPlan: data.plan, planName: data.race_name })
      )
      .catch((error) => console.error(error));
  }

  /**
   * Converts the plan in state to an array.
   * That array can then be mapped when it is rendered
   */
  convertToTable() {
    // Pull the plan data from state
    const plan: string = this.state.finalPlan as string;

    // Split the plan into an array of strings. Each string represnets a week
    const weeks = plan.split("-");

    // Create a matrix of runs. Each row is a week. Each col is a week day
    const planOutput = [];
    for (let i = 0; i < weeks.length; i++) {
      // Split the week into each days run
      const days = weeks[i].split(",");

      // Push each days run to the array and update weeks total mileage
      const weekOutput = [];
      let total = 0;
      for (let j = 0; j < days.length; j++) {
        weekOutput.push(days[j]);
        if (j !== 0) {
          total += parseFloat(days[j]);
        }
      }

      // Add the total to the week's array and add week to the matrix
      weekOutput.push(total);
      planOutput.push(weekOutput);
    }

    return planOutput;
  }

  /**
   * Initialize edit mode on a week of the trianing plan
   * @param rowKey Represents the key (week) in the plan being edited
   * @param week An array with the run values of the week to be edited
   */
  editTable(rowKey: number, week: any) {
    this.setState({
      inEditMode: {
        status: true,
        rowKey: rowKey,
      },

      startDateEdit: week[0],
      mondayEdit: week[1],
      tuesdayEdit: week[2],
      wednesdayEdit: week[3],
      thursdayEdit: week[4],
      fridayEdit: week[5],
      saturdayEdit: week[6],
      sundayEdit: week[7],
      totalEdit: week[8],
    });
  }

  /**
   * Save the results of table edit to state.
   * @param index represents the week of the plan that was edited
   * @param planData represents the entire plan matrix
   */
  saveTable(index: number, planData: [any]) {
    // Push the new row values for each day to the matrix
    planData[index] = [
      this.state.startDateEdit,
      this.state.mondayEdit,
      this.state.tuesdayEdit,
      this.state.wednesdayEdit,
      this.state.thursdayEdit,
      this.state.fridayEdit,
      this.state.saturdayEdit,
      this.state.sundayEdit,
      this.state.totalEdit,
    ];

    // Create trianing data string to push to matrix
    let outputPlan = "";
    for (let i = 0; i < planData.length; i++) {
      for (let j = 0; j < planData[0].length - 1; j++) {
        // Add a comma between runs during the week
        if (j !== planData[0].length - 2) {
          outputPlan += planData[i][j] + ",";
        }
        // Add a dash between the data for each week
        else {
          outputPlan += planData[i][j] + "-";
        }
      }
    }

    // Remove the trailing dash from the plan string
    outputPlan = outputPlan.slice(0, -1);

    // Clear the state edit mode variables and push new plan string
    this.setState({
      inEditMode: {
        status: false,
        rowKey: null,
      },
      mondayEdit: null,
      tuesdayEdit: null,
      wednesdayEdit: null,
      thursdayEdit: null,
      fridayEdit: null,
      saturdayEdit: null,
      sundayEdit: null,
      totalEdit: null,
      finalPlan: outputPlan,
    });
  }

  handleChange(event: any) {
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

    // Don't let any week day be edited to a negative number
    if (editDayNames.includes(name) && value < 0) {
      return;
    }

    this.setState({ [name]: value });
  }

  /**
   * Submit the current edited version of the plan to the database
   */
  submitPlan() {
    // Make sure the plan name field is not blank
    if (this.state.planName === '') {
      this.setState({ planName: "My AWESOME " + this.state.planData.race_name + " plan"})
    }

    // Create a JSON object to send edited plan to db in post request
    const planData = {
      race_name: this.state.planName,
      plan: this.state.finalPlan,
    };

    // Create headers for the API request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Send POST request to db with edited plan update the plan submitted in state to force redirect
    fetch(
      Config.rpAPI +
        `/training_plans/custom_plan/edit/${this.state.planData.id}`,
      {
        method: "POST",
        body: JSON.stringify(planData),
        headers: myHeaders,
      }
    )
      .then((response) => {
        if (response.status === 200) {
          this.setState({ planSubmitted: true });
        }
      })
      .catch((error) => console.error(error));
  }

  render() {
    // Run function to pull data into Matrix that can be rendered
    let planData: any = [];
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
                        {this.state.planData.race_name}
                      </h1>
                      <button
                        onClick={this.submitPlan}
                        className="btn btn-success custom_plan_button"
                      >
                        Save Plan
                      </button>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-md-6">
                        <input
                          type="text"
                          name="planName"
                          value={this.state.planName}
                          onChange={this.handleChange}
                          className="form-control custom_plan_button"
                          placeholder="Plan Name"
                        />
                      </div>
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
                            {planData.map((week: any, index: number) => (
                              <React.Fragment key={index}>
                                <tr>
                                  <td>
                                    <b>{getMonthDayFormat(week[0])}</b>
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
                                      <React.Fragment>{week[1]}</React.Fragment>
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
                                      <React.Fragment>{week[2]}</React.Fragment>
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
                                      <React.Fragment>{week[3]}</React.Fragment>
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
                                      <React.Fragment>{week[4]}</React.Fragment>
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
                                      <React.Fragment>{week[5]}</React.Fragment>
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
                                      <React.Fragment>{week[6]}</React.Fragment>
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
                                      <React.Fragment>{week[7]}</React.Fragment>
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
                                        {week[8].toFixed(1)}
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

export default EditPlan;
