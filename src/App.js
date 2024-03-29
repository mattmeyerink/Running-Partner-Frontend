import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./views/home";
import ResetPassword from "./views/Profile/resetPassword";
import SinglePlan from "./views/TrainingPlans/IndividualPlan";
import TrainingPlan from "./views/TrainingPlans/TrainingPlans";
import AddPlan from "./views/TrainingPlans/AddTrainingPlan";
import CustomPlan from "./views/TrainingPlans/customTrainingPlan";
import PersonalPlan from "./views/MyPlans/PersonalPlan";
import EditPlan from "./views/MyPlans/EditPersonalPlan";
import MyPlans from "./views/MyPlans/MyPlans";
import AllRuns from "./views/Runs/AllRuns";
import GeneralHelp from "./views/Help/generalHelp";
import Login from "./views/Authentication/login";
import Registration from "./views/Authentication/register";
import ConfirmPasswordReset from "./views/Authentication/confirmPasswordReset";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import AlertBanner from "./components/Alert";
import Config from "./config";
import "./index.css";

class App extends Component {
  constructor() {
    super();

    this.state = {
      userAuthenticated: false,
      userData: {},
      currentPage: "",
      currentPath: "",

      alertData: {
        showAlertBanner: false,
        alertVariant: "",
        alertHeader: "",
        alertMessage: "",
      }
    };

    this.showAlertMessage = this.showAlertMessage.bind(this);
    this.hideAlertMessage = this.hideAlertMessage.bind(this);
    this.setCurrentPage = this.setCurrentPage.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.refreshUserData = this.refreshUserData.bind(this);
  }

  componentDidMount() {
    // Retrive user data from local storage to determine if already logged in
    const userDataRaw = localStorage.getItem("userData");
    if (userDataRaw) {
      const userData = JSON.parse(userDataRaw);

      // Attempt to refresh the user data if saved data is valid
      if (userData.id) {
        this.refreshUserData(userData.id, userData.token);
      } else {
        this.logout();
      }
    }

    // Retrive current path from local storage to determine if page saved
    const currentPath = localStorage.getItem("currentPath");
    if (currentPath) {
      this.setState({ currentPath: currentPath });
    }
  }

  /*
   * Sets the current page to pass to the nav bar
   * @param page a string representing the current page
   */
  setCurrentPage(page) {
    this.setState({ currentPage: page });
  }

  /*
   * Login the user. Passed to login screen
   * @param data A JSON object containing the user's data
   */
  login(data) {
    // Store the data in local storage for persistent login
    const dataAltered = JSON.stringify(data);
    localStorage.setItem("userData", dataAltered);

    // Set authentication data in state for current session
    this.setState({
      userAuthenticated: true,
      userData: data,
    });
  }

  /*
   * Logout the current user. Passed to logout screen
   */
  logout() {
    // Clear user data from local storage
    localStorage.clear();

    // Clear user data from current state
    this.setState({
      userAuthenticated: false,
      userData: {},
    });
  }

  /*
   * Re pull the user data after an edit in the profile page.
   * Passed to the profile page.
   * @params userId The id of the user
   * @params token API authentication token
   */
  refreshUserData(userId, token) {
    // Set Headers required for API Request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    });

    // Submit request and store user data
    fetch(Config.rpAPI + `/authentication/get_user_data/${userId}`, {
      method: "GET",
      headers: myHeaders,
    })
      .then((response) => response.json())
      .then((data) => {
        // Set user to logged out and clear local storage if token has expired
        if (data.msg === "Token has expired") {
          this.setState({ userAuthenticated: false });
          localStorage.clear();
        }

        // Set the user to logged in/save new data if token valid
        else {
          this.setState({ userData: data, userAuthenticated: true });
          const dataAltered = JSON.stringify(data);
          localStorage.setItem("userData", dataAltered);
        }
      })
      .catch((error) => console.error(error));
  }

  /**
   * Updates state to display the alert message
   * @param {*} variant Type of message being displayed
   * @param {*} header Header banner message being displayed
   * @param {*} message Message to be displayed
   */
  showAlertMessage(variant, header, message) {
    this.setState({
      alertData: {
        showAlertBanner: true,
        alertVariant: variant,
        alertHeader: header,
        alertMessage: message,
      }
    });
  }

  /**
   * Updates state to clear and hide the alert message
   */
  hideAlertMessage() {
    this.setState({
      alertData: {
        showAlertBanner: false,
        alertVariant: "",
        alertHeader: "",
        alertMessage: "",
      }
    });
  }

  render() {
    // Setting background for entire app here. CSS was being broken don't know why
    document.body.style.backgroundColor = "#323232";

    return (
      <div>
        <NavBar
          userData={this.state.userData}
          refreshUserData={this.refreshUserData}
          userAuthenticated={this.state.userAuthenticated}
          logout={this.logout}
          currentPage={this.state.currentPage}
        />
        <AlertBanner
          show={this.state.alertData.showAlertBanner}
          variant={this.state.alertData.alertVariant}
          header={this.state.alertData.alertHeader}
          message={this.state.alertData.alertMessage}
          hideAlertMessage={this.hideAlertMessage}
        />
        <main className="container footer_space">
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Home
                  showAlertMessage={this.showAlertMessage}
                  userAuthenticated={this.state.userAuthenticated}
                  userData={this.state.userData}
                  setCurrentPage={this.setCurrentPage}
                />
              )}
            />

            <Route
              exact
              path="/training_plans"
              render={() => (
                <TrainingPlan
                  userAuthenticated={this.state.userAuthenticated}
                  userData={this.state.userData}
                  setCurrentPage={this.setCurrentPage}
                />
              )}
            />

            <Route
              exact
              path="/custom_plan"
              render={() => (
                <CustomPlan
                  userAuthenticated={this.state.userAuthenticated}
                  userData={this.state.userData}
                  setCurrentPage={this.setCurrentPage}
                />
              )}
            />

            <Route
              exact
              path="/training_plans/:id"
              render={({ match }) => (
                <SinglePlan
                  match={match}
                  userAuthenticated={this.state.userAuthenticated}
                  userData={this.state.userData}
                  setCurrentPage={this.setCurrentPage}
                />
              )}
            />

            <Route
              exact
              path="/personal_plan"
              render={() => (
                <MyPlans
                  userAuthenticated={this.state.userAuthenticated}
                  userData={this.state.userData}
                  setCurrentPage={this.setCurrentPage}
                />
              )}
            />

            <Route
              exact
              path="/personal_plan/:id"
              render={({ match }) => (
                <PersonalPlan
                  match={match}
                  userData={this.state.userData}
                  refreshUserData={this.refreshUserData}
                  setCurrentPage={this.setCurrentPage}
                />
              )}
            />

            <Route
              exact
              path="/personal_plan/edit/:id"
              render={({ match }) => (
                <EditPlan
                  match={match}
                  userAuthenticated={this.state.userAuthenticated}
                  userData={this.state.userData}
                  setCurrentPage={this.setCurrentPage}
                />
              )}
            />

            <Route
              exact
              path="/add_plan/:id"
              render={({ match }) => (
                <AddPlan
                  match={match}
                  userAuthenticated={this.state.userAuthenticated}
                  userData={this.state.userData}
                  setCurrentPage={this.setCurrentPage}
                />
              )}
            />

            <Route
              exact
              path="/all_runs"
              render={() => (
                <AllRuns
                  showAlertMessage={this.showAlertMessage}
                  userAuthenticated={this.state.userAuthenticated}
                  userData={this.state.userData}
                  setCurrentPage={this.setCurrentPage}
                />
              )}
            />

            <Route
              exact
              path="/reset_password/:id"
              render={({ match }) => (
                <ResetPassword
                  match={match}
                  setCurrentPage={this.setCurrentPage}
                />
              )}
            />

            <Route
              exact
              path="/help"
              render={() => (
                <GeneralHelp setCurrentPage={this.setCurrentPage} />
              )}
            />

            <Route
              exact
              path="/login"
              render={() => (
                <Login
                  login={this.login}
                  userAuthenticated={this.state.userAuthenticated}
                  userData={this.state.userData}
                  setCurrentPage={this.setCurrentPage}
                />
              )}
            />

            <Route
              exact
              path="/registration"
              render={() => (
                <Registration setCurrentPage={this.setCurrentPage} />
              )}
            />

            <Route
              exact
              path="/confirm_password_reset"
              render={() => <ConfirmPasswordReset />}
            />
          </Switch>
        </main>

        {this.state.userAuthenticated && <Footer />}

        {this.state.currentPath ? (
          <Redirect to={this.state.currentPath} />
        ) : (
          <React.Fragment />
        )}
      </div>
    );
  }
}

export default App;
