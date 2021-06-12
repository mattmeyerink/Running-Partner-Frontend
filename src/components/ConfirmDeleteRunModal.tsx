import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import { getLongDateFormat } from "../utility/DateFormatters";

interface ConfirmDeleteRunModalProps {
  userData: any;
  runBeingDeleted: any;
  showDeleteModal: boolean;
  handleDeleteModalClose(): void;
  getRunData(): void;
}

class ConfirmDeleteRunModal extends Component<ConfirmDeleteRunModalProps> {
  render() {
    return (
      <Modal show={this.props.showDeleteModal} onHide={this.props.handleDeleteModalClose} >
        <Modal.Header>
          <h4>Confirm Run Delete</h4>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your <b>{this.props.runBeingDeleted.distance} mile</b> run on <br/> <b>{getLongDateFormat(this.props.runBeingDeleted.date)}?</b>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={this.props.handleDeleteModalClose} className="btn btn-success">Cancel</button>
          <button className="btn btn-success">Submit</button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ConfirmDeleteRunModal;
