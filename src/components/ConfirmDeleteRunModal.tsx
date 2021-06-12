import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";

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
          Confirm Run Delete
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this run?
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-success">Cancel</button>
          <button className="btn btn-success">Submit</button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ConfirmDeleteRunModal;
