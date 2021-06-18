import React, {Component} from "react";
import Modal from "react-bootstrap/Modal";

interface ProfileModalProps {
  showProfileModal: boolean;
  handleProfileModalClose(): void;
}

class ProfileModal extends Component<ProfileModalProps> {
  render() {
    return(
      <Modal show={this.props.showProfileModal} onHide={this.props.handleProfileModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This will contain the profile information!
        </Modal.Body>
      </Modal>
    );
  }
}

export default ProfileModal;
