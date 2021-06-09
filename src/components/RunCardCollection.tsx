import React, { Component } from "react";
import CardColumns from "react-bootstrap/CardColumns";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getStandardDateFormat } from "../utility/DateFormatters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import EditRunModal from "./EditRunModal";

interface RunCardCollectionProps {
  runs: any;
  deleteRun(id: number): void;
}

interface RunCardCollectionState {
  showEditModal: boolean;
}

class RunCardCollection extends Component<
  RunCardCollectionProps,
  RunCardCollectionState
> {
  constructor(props: RunCardCollectionProps) {
    super(props);

    this.state = {
      showEditModal: false,
    };
    this.handleEditModalOpen = this.handleEditModalOpen.bind(this);
    this.handleEditModalClose = this.handleEditModalClose.bind(this);
  }

  handleEditModalOpen() {
    this.setState({ showEditModal: true });
  }

  handleEditModalClose() {
    this.setState({ showEditModal: false });
  }

  render() {
    return (
      <React.Fragment>
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
                      <strong>{getStandardDateFormat(run.date)}</strong>
                    </Col>
                    <Col className="text-right">
                      <button className="new_icon_button">
                        <FontAwesomeIcon
                          icon={faEdit}
                          color="blue"
                          onClick={this.handleEditModalOpen}
                        />
                      </button>
                      <button
                        className="new_icon_button"
                        onClick={() => this.props.deleteRun(run.id)}
                      >
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
        <EditRunModal
          handleEditModalClose={this.handleEditModalClose}
          showEditModal={this.state.showEditModal}
        />
      </React.Fragment>
    );
  }
}

export default RunCardCollection;
