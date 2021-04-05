import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Config from "../config";
import "./components.css";

/*
 * Class to display training plan information in a small header.
 * Specifically for the personal training plan header.
 */
class MyPlanHeader extends Component {
  constructor() {
    super();

    this.state = {};

    this.deletePlan = this.deletePlan.bind(this);
  }

  /*
   * Deletes a custom plan from the db
   */
  deletePlan() {
    // Prepare headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Send the request to delete the plan
    fetch(
      Config.rpAPI + `/training_plans/custom_plan/delete/${this.props.id}`,
      {
        method: "DELETE",
        headers: myHeaders,
      }
    )
      .then((response) => {
        if (response.status === 200) {
          this.props.getTrainingPlans();
        }
      })
      .catch((error) => console.error(error));
  }

  render() {
    // Split the plan to gather the start and end date
    const planSplit = this.props.plan.split("-");
    const startDate = planSplit[0].split(",")[0];
    const endDate = planSplit[planSplit.length - 1].split(",")[0];

    return (
      <React.Fragment>
        <div className="col-md-8 training_plan_card">
          <div className="row">
            <div className="col-md-11">
              <Link to={`/personal_plan/${this.props.id}`}>
                <h5>
                  {this.props.race_name} - {this.props.difficulty}
                </h5>
              </Link>
            </div>
            <div className="col-md-1">
              <button className="icon_button" onClick={this.deletePlan}>
                <FontAwesomeIcon icon={faTrash} color="red" />
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-10">
              <p>
                Week of <b>{startDate}</b> through the week of <b>{endDate}</b>
              </p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default MyPlanHeader;
