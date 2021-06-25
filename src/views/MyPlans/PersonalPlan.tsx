import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Config from "../../config";
import "../../index.css";
import { getMonthDayFormat } from "../../utility/DateFormatters";

interface PersonalPlanProps {
  setCurrentPage(page: string): void;
  userData: any;
  match: any;
  refreshUserData(id: number, token: string): void;
}

interface PersonalPlanState {
  planData: any;
  planDeleted: boolean;
  editingPlan: boolean;
  loading: boolean;
}

/**
 * View to display a specific personal training plan
 */
class PersonalPlan extends Component<PersonalPlanProps, PersonalPlanState> {
  constructor(props: PersonalPlanProps) {
    super(props);

    this.state = {
      planData: {},
      planDeleted: false,
      editingPlan: false,
      loading: true,
    };

    this.convertToTable = this.convertToTable.bind(this);
    this.deletePlan = this.deletePlan.bind(this);
    this.editPlan = this.editPlan.bind(this);
    this.setActivePlan = this.setActivePlan.bind(this);
    this.removeActivePlan = this.removeActivePlan.bind(this);
  }

  componentDidMount() {
    // Set the current page to myTrainingPlans for the nav bar
    this.props.setCurrentPage("myTrainingPlans");

    // Prepare headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Gather the training plan data
    fetch(
      Config.rpAPI +
        `/training_plans/custom_plan/${this.props.match.params.id}`,
      {
        method: "GET",
        headers: myHeaders,
      }
    )
      .then((response) => response.json())
      .then((data) => this.setState({ planData: data, loading: false }))
      .catch((error) => console.error(error));
  }

  /*
   * Sets this plan as the current user's active plan
   */
  setActivePlan() {
    // Prepare active plan data for the request
    const activePlanData = {
      user_id: this.props.userData.id,
      plan_id: this.state.planData.id,
    };

    // Prepare the headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Post the new active plan to the API
    fetch(Config.rpAPI + "/authentication/set_active_plan", {
      method: "POST",
      body: JSON.stringify(activePlanData),
      headers: myHeaders,
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.refreshUserData(
            this.props.userData.id,
            this.props.userData.token
          );
        }
      })
      .catch((error) => console.error(error));
  }

  /*
   * Delete this plan as teh active plan for the user.
   * Note that no plan is signified as a -1
   */
  removeActivePlan() {
    // Set active plan to -1 (to signify empty)
    const activePlanData = {
      user_id: this.props.userData.id,
      plan_id: -1,
    };

    // Prepare the headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Post request to delete the current active plan
    fetch(Config.rpAPI + "/authentication/set_active_plan", {
      method: "POST",
      body: JSON.stringify(activePlanData),
      headers: myHeaders,
    })
      .then((response) => {
        if (response.status === 200) {
          this.props.refreshUserData(
            this.props.userData.id,
            this.props.userData.token
          );
        }
      })
      .catch((error) => console.error(error));
  }

  /*
   * Converts the plan in state to a matrix
   */
  convertToTable() {
    const planOutput = [];

    // If the plan has been pulled from the API, handle the data
    if (this.state.planData.plan !== undefined) {
      const plan = this.state.planData.plan;

      // Split the plan data into individual weeks
      const weeks = plan.split("-");

      for (let i = 0; i < weeks.length; i++) {
        // Split the week string into individual runs
        const days = weeks[i].split(",");

        // Push each day to the week array and update the total
        const weekOutput = [];
        let total = 0;
        for (let j = 0; j < days.length; j++) {
          weekOutput.push(days[j]);
          if (j > 0) {
            total += parseFloat(days[j]);
          }
        }

        // Push the total to the week array and push the week to the matrix
        weekOutput.push(total);
        planOutput.push(weekOutput);
      }
    }
    return planOutput;
  }

  /*
   * Delete a specific plan from the database
   */
  deletePlan() {
    // Initialize headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Make the call to delete the plan
    fetch(
      Config.rpAPI +
        `/training_plans/custom_plan/delete/${this.state.planData.id}`,
      {
        method: "DELETE",
        headers: myHeaders,
      }
    )
      .then((response) => {
        if (response.status === 200) {
          this.setState({ planDeleted: true });
        }
      })
      .catch((error) => console.error(error));
  }

  /*
   * Update state to editing plan to force re-direct to plan editing page
   */
  editPlan() {
    this.setState({ editingPlan: true });
  }

  render() {
    const training_plan = this.state.planData;
    const planData = this.convertToTable();

    return (
      <React.Fragment>
        {this.state.editingPlan ? (
          <Redirect to={`/personal_plan/edit/${this.props.match.params.id}`} />
        ) : (
          <React.Fragment>
            {this.state.planDeleted ? (
              <Redirect to="/personal_plan" />
            ) : (
              <React.Fragment>
                {this.state.loading ? (
                  <div className="row justify-content-center loading_height">
                    <h1 className="white_text">
                      Loading <Spinner animation="border" variant="light" />
                    </h1>
                  </div>
                ) : (
                  <React.Fragment>
                    <div className="row justify-content-center">
                      <h1 className="white_text">
                        {training_plan.race_name}
                      </h1>
                    </div>
                    <div className="row justify-content-center">
                      {this.props.userData.active_plan ===
                      this.state.planData.id ? (
                        <button
                          onClick={this.removeActivePlan}
                          className="btn btn-warning button_spacing"
                        >
                          Remove Active Plan
                        </button>
                      ) : (
                        <button
                          onClick={this.setActivePlan}
                          className="btn btn-success button_spacing"
                        >
                          Set As Active Plan
                        </button>
                      )}
                      <button
                        onClick={this.deletePlan}
                        className="btn btn-danger button_spacing"
                      >
                        Delete Plan
                      </button>
                      <button
                        onClick={this.editPlan}
                        className="btn btn-warning button_spacing"
                      >
                        Edit Plan
                      </button>
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
                                    <b>{getMonthDayFormat(week[0])}</b>
                                  </td>
                                  <td>{week[1]}</td>
                                  <td>{week[2]}</td>
                                  <td>{week[3]}</td>
                                  <td>{week[4]}</td>
                                  <td>{week[5]}</td>
                                  <td>{week[6]}</td>
                                  <td>{week[7]}</td>
                                  <td>
                                    <b>{week[8].toFixed(1)}</b>
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
        )}
      </React.Fragment>
    );
  }
}

export default PersonalPlan;
