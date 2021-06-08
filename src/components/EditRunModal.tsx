import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

interface EditRunModalProps {
  handleEditModalClose(): void,
  showEditModal: boolean
};

interface EditRunModalState {
}

class EditRunModal extends Component<EditRunModalProps, EditRunModalState> {
  constructor(props: EditRunModalProps) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <Modal
        show={this.props.showEditModal}
        onHide={this.props.handleEditModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Run</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Run edit form will come prefilled right here</p>
        </Modal.Body>
        <Modal.Footer>
          <Button>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EditRunModal;
