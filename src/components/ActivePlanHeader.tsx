import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import Config from "../config";
import { getLongDateFormat } from "../utility/DateFormatters";

interface ActivePlanProps {
  activePlan: any;
  getTrainingPlans(): void;
  userData: any;
}

interface DatesObject {
  startDate: string;
  endDate: string;
}

/**
 * Displays the active plan header. Currently used on the my training plans page
 */
class ActivePlanHeader extends Component<ActivePlanProps> {
  constructor(props: ActivePlanProps) {
    super(props);

    this.getStartEndDates = this.getStartEndDates.bind(this);
    this.deletePlan = this.deletePlan.bind(this);
  }

  /**
   * Get the start and the end dates from the active plan in props
   * @returns The start and end dates from the active plan
   */
  getStartEndDates(): DatesObject {
    const planSplit = this.props.activePlan.plan.split("-");
    const startDate = planSplit[0].split(",")[0];
    const endMonday = planSplit[planSplit.length - 1].split(",")[0];

    const endDate = moment(endMonday).add(6, 'days').format("MMMM Do, YYYY");

    const dates = {
      startDate: startDate,
      endDate: endDate
    };

    return dates;
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
      Config.rpAPI + `/training_plans/custom_plan/delete/${this.props.activePlan.id}`,
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
    const dates = this.getStartEndDates();
    return (
      <Container fluid>
        <Card>
          <Card.Header>
            <h4>Active Plan</h4>
          </Card.Header>

          <Card.Body>
            <Row>
              <Col xs={8}>
                <Card.Title>
                  <Link to={`/personal_plan/${this.props.activePlan.id}`}>
                    {this.props.activePlan.race_name} ({this.props.activePlan.difficulty})
                  </Link>
                </Card.Title>
                <Card.Text>
                  Starts on <b>Monday {getLongDateFormat(dates.startDate)}</b> and ends on {" "}
                  <b>Sunday {dates.endDate}</b>
                </Card.Text>
              </Col>
              <Col className="text-right">
                <Link
                  to={`/personal_plan/edit/${this.props.activePlan.id}`}
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
      </Container>
    );
  }
}

export default ActivePlanHeader;
