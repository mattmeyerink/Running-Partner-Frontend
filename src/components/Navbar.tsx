import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCalendarPlus,
  faRunning,
  faInfoCircle,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import ProfileModal from "./ProfileModal";
import "./components.css";

interface NavBarProps {
  currentPage: string;
  userData: any;
  userAuthenticated: boolean;
  logout: any;
  refreshUserData(): void;
}

interface NavBarState {
  showProfileModal: boolean;
}

/**
 * Class to handle the navbar to be displayed on every page
 */
class NavBar extends Component<NavBarProps, NavBarState> {
  constructor(props: NavBarProps) {
    super(props);
    this.state = {
      showProfileModal: false,
    };

    this.handleProfileModalOpen = this.handleProfileModalOpen.bind(this);
    this.handleProfileModalClose = this.handleProfileModalClose.bind(this);
  }

  /**
   * Open the Profile Modal
   */
  handleProfileModalOpen() {
    this.setState({ showProfileModal: true });
  }

  /**
   * Close the Profile Modal
   */
  handleProfileModalClose() {
    this.setState({ showProfileModal: false });
  }

  render() {
    // Retrieve the current page from props to highlight the correct
    const { currentPage } = this.props as NavBarProps;

    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg  navbar-dark navbar_custom">
          <Link className="navbar-brand" to="/">
            Running Partner
          </Link>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li
                className={
                  currentPage === "myTrainingPlans"
                    ? "nav-item active"
                    : "nav-item"
                }
              >
                <Link className="nav-link" to="/personal_plan">
                  <FontAwesomeIcon
                    icon={faChartLine}
                    color="white"
                    className="nav_icon"
                  />{" "}
                  My Training Plans
                </Link>
              </li>
              <li
                className={
                  currentPage === "myRuns" ? "nav-item active" : "nav-item"
                }
              >
                <Link className="nav-link" to="/all_runs">
                  <FontAwesomeIcon
                    icon={faRunning}
                    color="white"
                    className="nav_icon"
                  />{" "}
                  My Runs
                </Link>
              </li>
              <li
                className={
                  currentPage === "allTrainingPlans"
                    ? "nav-item active"
                    : "nav-item"
                }
              >
                <Link className="nav-link" to="/training_plans">
                  <FontAwesomeIcon
                    icon={faCalendarPlus}
                    color="white"
                    className="nav_icon"
                  />{" "}
                  Training Plans
                </Link>
              </li>
              <li
                className={
                  currentPage === "help" ? "nav-item active" : "nav-item"
                }
              >
                <Link className="nav-link" to="/help">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    color="white"
                    className="nav_icon"
                  />{" "}
                  Help
                </Link>
              </li>
            </ul>
            {this.props.userAuthenticated ? (
              <React.Fragment>
                <button
                  className="btn btn-secondary"
                  onClick={this.handleProfileModalOpen}
                >
                  <FontAwesomeIcon
                    icon={faIdCard}
                    color="white"
                    className="nav_icon"
                  />{" "}
                  Profile
                </button>
                <button
                  className="btn btn-secondary registration_btn"
                  onClick={this.props.logout}
                >
                  Logout
                </button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link
                  to="/registration"
                  className="btn btn-secondary registration_btn"
                >
                  Register
                </Link>
              </React.Fragment>
            )}
          </div>
        </nav>
        <ProfileModal
          logout={this.props.logout}
          userData={this.props.userData}
          refreshUserData={this.props.refreshUserData}
          showProfileModal={this.state.showProfileModal}
          handleProfileModalClose={this.handleProfileModalClose}
        />
      </React.Fragment>
    );
  }
}

export default NavBar;
