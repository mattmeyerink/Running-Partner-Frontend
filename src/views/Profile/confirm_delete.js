import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Config from "../../config";

/*
 * View cofirming the user would like to delete their account
 */
class ConfirmDeleteAccount extends Component {
  constructor() {
    super();

    this.state = {
      accountDeleted: false,
    };

    this.deleteAccount = this.deleteAccount.bind(this);
  }

  componentDidMount() {
    // Set the current page to profile for the nav bar
    this.props.setCurrentPage("profile");

    // Set current path in local storage
    localStorage.setItem(
      "currentPath",
      `/profile/confirm_delete/${this.props.match.params.id}`
    );
  }

  /*
   * Method to delete the user's account
   */
  deleteAccount() {
    // Prepare headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Send the request to delete the account
    fetch(
      Config.rpAPI +
        `/authentication/delete_account/${this.props.match.params.id}`,
      {
        method: "DELETE",
        headers: myHeaders,
      }
    )
      .then((response) => {
        if (response.status === 200) {
          this.setState({ accountDeleted: true });
          this.props.logout();
        }
      })
      .catch((error) => console.error(error));
  }

  render() {
    return (
      <React.Fragment>
        {this.state.accountDeleted ? (
          <Redirect to="/login" />
        ) : (
          <React.Fragment>
            <div className="row justify-content-center">
              <h1 className="white_text">
                Are you sure you want to delete your account?
              </h1>
            </div>
            <div className="row justify-content-center">
              <h1 className="white_text">
                All data associated with it will be lost.
              </h1>
            </div>
            <div className="row justify-content-center">
              <button className="btn btn-danger" onClick={this.deleteAccount}>
                Delete Account
              </button>
            </div>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default ConfirmDeleteAccount;
