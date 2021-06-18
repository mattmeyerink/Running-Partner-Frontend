import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import StatesForm from "./StatesForm";

interface ProfileModalProps {
  userData: any;
  showProfileModal: boolean;
  handleProfileModalClose(): void;
  refreshUserData(): void;
}

interface ProfileModalState {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  city?: string;
  state?: string;
  editing?: boolean;
  deleting?: boolean;
  warning?: string;
  loading?: boolean;
}

class ProfileModal extends Component<ProfileModalProps, ProfileModalState> {
  constructor(props: ProfileModalProps) {
    super(props);
    this.state = {
      firstName: this.props.userData.first_name,
      lastName: this.props.userData.last_name,
      email: this.props.userData.email,
      username: this.props.userData.username,
      city: this.props.userData.city,
      state: this.props.userData.state,

      editing: false,
      deleting: false,
      warning: "",
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: any) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value });
  }

  /**
   * Submit the edit profile form and exit editing mode
   */
  handleSubmit() {
    console.log('Profile Changes Submitted!');
    this.setState({ editing: false });
  }

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
          <React.Fragment>
            {this.state.editing ? (
              <React.Fragment>
                <div className="row justify-content-center">
                  <h1 className="white_text">Edit Account Information</h1>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-6 background_color edit_profile_padding">
                    <form onSubmit={this.handleSubmit}>
                      <input
                        type="text"
                        name="firstName"
                        value={this.state.firstName}
                        onChange={this.handleChange}
                        className="form-control form_spacing"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        name="lastName"
                        value={this.state.lastName}
                        onChange={this.handleChange}
                        className="form-control form_spacing"
                        placeholder="Last Name"
                      />
                      <input
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={this.handleChange}
                        className="form-control form_spacing"
                        placeholder="Username"
                      />
                      <input
                        type="text"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        className="form-control form_spacing"
                        placeholder="Email"
                      />
                      <input
                        type="text"
                        name="city"
                        value={this.state.city}
                        onChange={this.handleChange}
                        className="form-control form_spacing"
                        placeholder="City"
                      />
                      <select
                        name="state"
                        value={this.state.state}
                        onChange={this.handleChange}
                        className="form-control form_spacing"
                      >
                        <StatesForm />
                      </select>
                      <p className="warning_text">{this.state.warning}</p>
                      <button
                        type="submit"
                        className="btn btn-success form-control"
                      >
                        Submit{" "}
                        {this.state.loading && (
                          <Spinner
                            animation="border"
                            variant="light"
                            size="sm"
                          />
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
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
              </React.Fragment>
            )}
          </React.Fragment>
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
