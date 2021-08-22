import React, { Component } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getStandardDateFormat } from "../utility/DateFormatters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import EditRunModal from "./EditRunModal";
import ConfirmDeleteRunModal from "./ConfirmDeleteRunModal";

interface RunBarListProps {
  runs: any;
  deleteRun(id: number): void;
  userData: any;
  getRunData(): void;
}

interface RunBarListState {
  showEditModal: boolean;
  runBeingEdited: any;
  showDeleteModal: boolean;
  runBeingDeleted: any;
  runs: any;
}

class RunBarList extends Component<RunBarListProps, RunBarListState> {
  constructor(props: RunBarListProps) {
    super(props);

    this.state = {
      showEditModal: false,
      runBeingEdited: null,
      showDeleteModal: false,
      runBeingDeleted: false,

      runs: [],
    };

    this.handleEditModalOpen = this.handleEditModalOpen.bind(this);
    this.handleEditModalClose = this.handleEditModalClose.bind(this);
    this.handleDeleteModalOpen = this.handleDeleteModalOpen.bind(this);
    this.handleDeleteModalClose = this.handleDeleteModalClose.bind(this);
    this.sortRunsByDate = this.sortRunsByDate.bind(this);
  }

  componentDidMount() {
    this.setState({ runs: this.props.runs });
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

  sortRunsByDate() {
    const runs = this.props.runs.slice(0);
    runs.sort((a: any, b: any) => {
      if (a.date < b.date) {
        return 1;
      } else if (a.date > b.date) {
        return -1;
      } else {
        return 0;
      }
    });
    return runs;
  }

  render() {
    const runs = this.sortRunsByDate();
    return (
      <div className="home_widgets">
        <ListGroup>
          {runs.map((run: any) => (
            <React.Fragment key={run.id}>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <h5>
                      {run.distance} Miles - {run.run_city}, {run.run_state} -{" "}
                      {getStandardDateFormat(run.date)}
                    </h5>
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
                {run.notes && 
                <Row className="some_run_notes_padding">
                  <Col>
                    <p>{run.notes}</p>
                  </Col>
                </Row>
                }
              </ListGroup.Item>
            </React.Fragment>
          ))}
        </ListGroup>

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
          deleteRun={this.props.deleteRun}
        ></ConfirmDeleteRunModal>
      </div>
    );
  }
}

export default RunBarList;
