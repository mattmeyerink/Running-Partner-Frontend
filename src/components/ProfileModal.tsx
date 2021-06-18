import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";

interface ProfileModalProps {
  userData: any;
  showProfileModal: boolean;
  handleProfileModalClose(): void;
  refreshUserData(): void;
}

class ProfileModal extends Component<ProfileModalProps> {
  render() {
    const { first_name, last_name, email, username, city, state, id } =
      this.props.userData;
    return (
      <Modal
        show={this.props.showProfileModal}
        onHide={this.props.handleProfileModalClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>{first_name}'s Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <b>Name:</b> {first_name} {last_name}
          </p>
          <p>
            <b>Username:</b> {username}
          </p>
          <p>
            <b>Email:</b> {email}
          </p>
          <p>
            <b>Running Location:</b> {city}, {state}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-warning text_spacing">Edit Account</button>
          <button className="btn btn-danger text_spacing">
            Delete Account
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ProfileModal;
