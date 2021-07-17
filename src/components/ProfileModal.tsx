import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Config from "../config";
import { confirmValidCity } from "../utility/FormFieldUtilities";
import StatesForm from "./StatesForm";

interface ProfileModalProps {
  userData: any;
  showProfileModal: boolean;
  logout(): void;
  handleProfileModalClose(): void;
  refreshUserData(id: number, token: string): void;
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

    this.finalizeDeleteAccount = this.finalizeDeleteAccount.bind(this);
    this.backOutOfConfirmDeleteAccount =
      this.backOutOfConfirmDeleteAccount.bind(this);
    this.enterConfirmDeleteAccount = this.enterConfirmDeleteAccount.bind(this);
    this.areFormFieldsValid = this.areFormFieldsValid.bind(this);
    this.beginEditing = this.beginEditing.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeProfileModal = this.closeProfileModal.bind(this);
  }

  handleChange(event: any) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value });
  }

  /**
   * Returns a boolean if the edit profile form fields are valid
   * @returns If the form fields are valid
   */
  areFormFieldsValid() {
    let warning = "";
    if (!this.state.firstName) {
      warning = "Please enter a first name!";
    } else if (!this.state.lastName) {
      warning = "Please enter a last name!";
    } else if (!this.state.email) {
      warning = "Please enter an email!";
    } else if (!this.state.username) {
      warning = "Please enter a username!";
    } else if (
      !confirmValidCity(this.state.city as string, this.state.state as string)
    ) {
      warning = "Please enter a valid city!";
    }

    if (warning) {
      this.setState({
        warning: warning,
        loading: false,
      });
      return false;
    }
    return true;
  }

  /**
   * Finalize the deletion of the user's account
   */
  finalizeDeleteAccount() {
    // Prepare headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Send the request to delete the account
    fetch(
      Config.rpAPI +
        `/authentication/delete_account/${this.props.userData.id}`,
      {
        method: "DELETE",
        headers: myHeaders,
      }
    )
      .then((response) => {
        if (response.status === 200) {
          this.props.logout();
          this.props.handleProfileModalClose();
        }
      })
      .catch((error) => console.error(error));
  }

  /**
   * Submit the edit profile form and exit editing mode
   */
  handleSubmit() {
    this.setState({ loading: true, warning: "" });

    if (!this.areFormFieldsValid()) {
      return;
    }

    // Create JSON of edited user data for POST Request
    const editedUserData = {
      id: this.props.userData.id,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      username: this.state.username,
      city: this.state.city,
      state: this.state.state,
    };

    // Prepare headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // POST request to update user's data in db
    fetch(Config.rpAPI + "/authentication/edit_profile", {
      method: "POST",
      body: JSON.stringify(editedUserData),
      headers: myHeaders,
    })
      .then((response) => {
        if (response.status === 200) {
          // Function to repull user data in the app to have most up to date info
          this.props.refreshUserData(
            this.props.userData.id,
            this.props.userData.token
          );

          // Clear the editing state to display user info again
          this.setState({ editing: false, loading: false, warning: "" });
        }
      })
      .catch((error) => console.error(error));

    this.setState({ loading: false });
  }

  /*
   * Set state to begin editing the user's data
   */
  beginEditing() {
    this.setState({ editing: true });
  }

  /**
   * Triggers account delete confirmation to appear in modal
   */
  enterConfirmDeleteAccount() {
    this.setState({ deleting: true });
  }

  /**
   * Triggers account delete confirmation to disapear from modal
   */
  backOutOfConfirmDeleteAccount() {
    this.setState({ deleting: false });
  }

  /**
   * Closes the profile modal and resets edit state of modal
   */
  closeProfileModal() {
    this.props.handleProfileModalClose();
    this.setState({
      editing: false
    });
  }

  render() {
    const { first_name, last_name, email, username, city, state } =
      this.props.userData;
    return (
      <Modal
        show={this.props.showProfileModal}
        onHide={this.closeProfileModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>My Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <React.Fragment>
            {this.state.deleting ? (
              <React.Fragment>
                Are you sure you want to delete your account? This action cannot be undone!
              </React.Fragment>
            ) : (
              <React.Fragment>
                {this.state.editing ? (
                  <React.Fragment>
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
                    </form>
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
            )}
          </React.Fragment>
        </Modal.Body>
        <Modal.Footer>
          {this.state.deleting ? (
            <React.Fragment>
              <button
                className="btn btn-outline-primary"
                onClick={this.backOutOfConfirmDeleteAccount}
              >
                Go Back
              </button>
              <button
                className="btn btn-danger text_spacing"
                onClick={this.finalizeDeleteAccount}
              >
                Delete Account
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {this.state.editing ? (
                <button
                  className="btn btn-success text-spacing"
                  onClick={this.handleSubmit}
                >
                  Submit{" "}
                  {this.state.loading && (
                    <Spinner animation="border" variant="light" size="sm" />
                  )}
                </button>
              ) : (
                <button
                  className="btn btn-warning text_spacing"
                  onClick={this.beginEditing}
                >
                  Edit Account
                </button>
              )}
              <button
                className="btn btn-danger text_spacing"
                onClick={this.enterConfirmDeleteAccount}
              >
                Delete Account
              </button>
            </React.Fragment>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ProfileModal;
