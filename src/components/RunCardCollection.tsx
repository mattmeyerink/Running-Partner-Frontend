import React, { Component } from "react";
import CardColumns from "react-bootstrap/CardColumns";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getStandardDateFormat } from "../utility/DateFormatters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import EditRunModal from "./EditRunModal";
import ConfirmDeleteRunModal from "./ConfirmDeleteRunModal";

interface RunCardCollectionProps {
  runs: any;
  deleteRun(id: number): void;
  userData: any;
  getRunData(): void;
}

interface RunCardCollectionState {
  showEditModal: boolean;
  runBeingEdited: any;
  showDeleteModal: boolean;
  runBeingDeleted: any;
}

class RunCardCollection extends Component<
  RunCardCollectionProps,
  RunCardCollectionState
> {
  constructor(props: RunCardCollectionProps) {
    super(props);

    this.state = {
      showEditModal: false,
      runBeingEdited: null,
      showDeleteModal: false,
      runBeingDeleted: false,
    };

    this.handleEditModalOpen = this.handleEditModalOpen.bind(this);
    this.handleEditModalClose = this.handleEditModalClose.bind(this);
    this.handleDeleteModalOpen = this.handleDeleteModalOpen.bind(this);
    this.handleDeleteModalClose = this.handleDeleteModalClose.bind(this);
  }

  handleEditModalOpen(run: any) {
    this.setState({ runBeingEdited: run, showEditModal: true });
  }

  handleEditModalClose() {
    this.setState({ showEditModal: false });
  }

  handleDeleteModalOpen(run: any) {
    this.setState({ runBeingDeleted: run, showDeleteModal: true });
  }

  handleDeleteModalClose() {
    this.setState({ showDeleteModal: false });
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
                          onClick={() => this.handleEditModalOpen(run)}
                        />
                      </button>
                      <button
                        className="new_icon_button"
                        onClick={() => this.handleDeleteModalOpen(run)}
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
          userData={this.props.userData}
          runBeingEdited={this.state.runBeingEdited}
          handleEditModalClose={this.handleEditModalClose}
          showEditModal={this.state.showEditModal}
          getRunData={this.props.getRunData}
        />
        <ConfirmDeleteRunModal
          userData={this.props.userData}
          runBeingDeleted={this.state.runBeingDeleted}
          showDeleteModal={this.state.showDeleteModal}
          handleDeleteModalClose={this.handleDeleteModalClose}
          getRunData={this.props.getRunData}
        ></ConfirmDeleteRunModal>
      </React.Fragment>
    );
  }
}

export default RunCardCollection;
