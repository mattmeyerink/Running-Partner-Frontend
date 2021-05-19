import React, { Component } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Config from "../config";

interface MyPlanCardProps {
  plan: any;
  userData: any;
  getTrainingPlans(): void;
}

class MyPlanCard extends Component<MyPlanCardProps> {
  constructor(props: MyPlanCardProps) {
    super(props);

    this.deletePlan = this.deletePlan.bind(this);
  }

  /**
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
      Config.rpAPI + `/training_plans/custom_plan/delete/${this.props.plan.id}`,
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
    const planSplit = this.props.plan.plan.split("-");
    const startDate = planSplit[0].split(",")[0];
    const endDate = planSplit[planSplit.length - 1].split(",")[0];

    return (
      <Card>
        <Card.Header>
          <Link to={`/personal_plan/${this.props.plan.id}`}>
          <h5>
            {this.props.plan.race_name} ({this.props.plan.difficulty})
          </h5>
          </Link>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Row>
                <b>Start:</b> {startDate}
              </Row>
              <Row>
                <b>End:</b> {endDate}
              </Row>
            </Col>
            <Col className="text-right">
              <Link
                to={`/personal_plan/edit/${this.props.plan.id}`}
                className="icon_button edit_icon"
              >
                <FontAwesomeIcon icon={faEdit} />
              </Link>
              <button className="icon_button" onClick={this.deletePlan}>
                <FontAwesomeIcon icon={faTrash} color="red" />
              </button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  }
}

export default MyPlanCard;
