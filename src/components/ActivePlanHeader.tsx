import React, { Component } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

interface ActivePlanProps {
  activePlan: any;
}

interface DatesObject {
  startDate: string;
  endDate: string;
}


class ActivePlanHeader extends Component<ActivePlanProps> {
  /**
   * Get the start and the end dates from the active plan in props
   * @returns The start and end dates from the active plan
   */
  getStartEndDates(): DatesObject {
    const planSplit = this.props.activePlan.plan.split("-");
    const startDate = planSplit[0].split(",")[0];
    const endDate = planSplit[planSplit.length - 1].split(",")[0];

    const dates = {
      startDate: startDate,
      endDate: endDate
    };

    return dates;
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
              <Col>
                <Card.Title>{this.props.activePlan.race_name}</Card.Title>
                <Card.Text>
                  Week of <b>{dates.startDate}</b> through the week of{" "}
                  <b>{dates.endDate}</b>
                </Card.Text>
              </Col>
              <Col className="text-right">
                <Link
                  to={`/personal_plan/edit/${this.props.activePlan.id}`}
                  className="icon_button edit_icon"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Link>
                <button className="icon_button">
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
