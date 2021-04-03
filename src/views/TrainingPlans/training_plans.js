import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PlanHeader from "../../components/plan_header";
import Config from "../../config";
import "../../index.css";

/*
 * Class that displays all of the available training plans
 */
class TrainingPlan extends Component {
  constructor() {
    super();

    this.state = {
      training_plans: [],
      planType: "All-Plans",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // Set current page to allTraining Plans for the nav bar
    this.props.setCurrentPage("allTrainingPlans");

    // Set current path in local storage
    localStorage.setItem('currentPath', '/training_plans');

    // Prepare headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Send the API request to gather all of the plan data
    fetch(Config.rpAPI + "/training_plans/all_plans", {
      method: "GET",
      headers: myHeaders,
    })
      .then((result) => result.json())
      .then((data) => this.setState({ training_plans: data }))
      .catch((error) => console.error(error));
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value });
  }

  render() {
    return (
      <React.Fragment>
        {this.props.userAuthenticated ? (
          <React.Fragment>
            <div className="row justify-content-center">
              <h1 className="white_text">Training Plans</h1>

              <form className="filter_dropdown">
                <select
                  name="planType"
                  value={this.state.planType}
                  onChange={this.handleChange}
                >
                  <option value="All-Plans">All Plans</option>
                  <option value="5k">5k</option>
                  <option value="10k">10k</option>
                  <option value="Half-Marathon">Half Marathon</option>
                  <option value="Marathon">Marathon</option>
                  <option value="Base Training">Base Training</option>
                  <option value="Custom">Custom</option>
                </select>
              </form>
            </div>

            <div className="row justify-content-center">
              {this.state.training_plans.map((plan) =>
                this.state.planType === "All-Plans" ||
                this.state.planType === plan.race_name ? (
                  <PlanHeader
                    key={plan.id}
                    id={plan.id}
                    difficulty={plan.difficulty}
                    frequency={plan.frequency}
                    plan_length={plan.plan_length}
                    race_length={plan.race_length}
                    race_name={plan.race_name}
                  />
                ) : (
                  <React.Fragment key={plan.id}></React.Fragment>
                )
              )}
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

export default TrainingPlan;
