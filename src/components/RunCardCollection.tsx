import React, { Component } from "react";
import CardColumns from "react-bootstrap/CardColumns";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getStandardDateFormat } from "../utility/DateFormatters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface RunCardCollectionProps {
  runs: any;
  deleteRun(id: number): void;
}

class RunCardCollection extends Component<RunCardCollectionProps> {
  render() {
    return (
      <CardColumns>
        {this.props.runs.map((run: any) => (
          <React.Fragment key={run.id}>
            <Card>
              <Card.Header>
                <h5>
                  {run.distance} Miles - {run.run_city}, {run.run_state}
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <strong>
                      {getStandardDateFormat(run.date)}
                    </strong>
                  </Col>
                  <Col className="text-right">
                    <button className="new_icon_button" onClick={() => this.props.deleteRun(run.id)}>
                      <FontAwesomeIcon icon={faTrash} color="red" />
                    </button>
                  </Col>
                </Row>
                <Row className="some_run_notes_padding">
                  <Col>
                    <p>{run.notes}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </React.Fragment>
        ))}
      </CardColumns>
    );
  }
}

export default RunCardCollection;
