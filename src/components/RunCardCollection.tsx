import React, { Component } from "react";
import CardColumns from "react-bootstrap/CardColumns";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { getStandardDateFormat } from "../utility/DateFormatters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

interface RunCardCollectionProps {
  runs: any;
  deleteRun(id: number): void;
}

interface RunCardCollectionState {
  showEditModal: boolean;
}

class RunCardCollection extends Component<RunCardCollectionProps, RunCardCollectionState> {
  constructor(props: RunCardCollectionProps) {
    super(props);

    this.state = {
      showEditModal: false,
    }
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
                    <button className="new_icon_button">
                      <FontAwesomeIcon icon={faEdit} color="blue" onClick={this.handleEditModalOpen} />
                    </button>
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
            <Modal show={this.state.showEditModal} onHide={this.handleEditModalClose} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>
                  Edit Run
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Run edit form will come prefilled right here</p>
              </Modal.Body>
              <Modal.Footer>
                <Button>Submit</Button>
              </Modal.Footer>
            </Modal>
          </React.Fragment>
        ))}
      </CardColumns>
    );
  }
}

export default RunCardCollection;
