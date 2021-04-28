import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCalendarPlus, faRunning, faUser, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import "./components.css";

interface NavBarProps {
  currentPage: string;
  userAuthenticated: boolean;
  logout: any;
}

/**
 * Class to handle the navbar to be displayed on every page
 */
class NavBar extends Component<NavBarProps> {
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
                  <FontAwesomeIcon icon={faChartLine} color="white" className="nav_icon" /> My Training Plans
                </Link>
              </li>
              <li
                className={
                  currentPage === "myRuns" ? "nav-item active" : "nav-item"
                }
              >
                <Link className="nav-link" to="/all_runs">
                  <FontAwesomeIcon icon={faRunning} color="white" className="nav_icon" /> My Runs
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
                  <FontAwesomeIcon icon={faCalendarPlus} color="white" className="nav_icon" /> Training Plans
                </Link>
              </li>
              <li
                className={
                  currentPage === "profile" ? "nav-item active" : "nav-item"
                }
              >
                <Link className="nav-link" to="/profile">
                  <FontAwesomeIcon icon={faUser} color="white" className="nav_icon" /> Profile
                </Link>
              </li>
              <li
                className={
                  currentPage === "help" ? "nav-item active" : "nav-item"
                }
              >
                <Link className="nav-link" to="/help">
                  <FontAwesomeIcon icon={faInfoCircle} color="white" className="nav_icon" /> Help
                </Link>
              </li>
            </ul>
            {this.props.userAuthenticated ? (
              <button className="btn btn-secondary" onClick={this.props.logout}>
                Logout
              </button>
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
      </React.Fragment>
    );
  }
}

export default NavBar;
