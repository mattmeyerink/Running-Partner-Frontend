import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./views/home";
import Profile from "./views/Profile/profile";
import ConfirmDeleteAccount from "./views/Profile/confirm_delete";
import ResetPassword from "./views/Profile/resetPassword";
import SinglePlan from "./views/TrainingPlans/individual_plan";
import TrainingPlan from "./views/TrainingPlans/training_plans";
import AddPlan from "./views/TrainingPlans/add_training_plan";
import CustomPlan from "./views/TrainingPlans/customTrainingPlan";
import PersonalPlan from "./views/MyPlans/personal_plan";
import EditPlan from "./views/MyPlans/edit_personal_plan";
import MyPlans from "./views/MyPlans/my_plans";
import AllRuns from "./views/Runs/all_runs";
import GeneralHelp from "./views/Help/generalHelp";
import Login from "./views/Authentication/login";
import Registration from "./views/Authentication/register";
import ConfirmPasswordReset from "./views/Authentication/confirmPasswordReset";
import NavBar from "./components/navbar";
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
    };

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

  render() {
    // Setting background for entire app here. CSS was being broken don't know why
    document.body.style.backgroundColor = "#323232";

    return (
      <div>
        <NavBar
          userAuthenticated={this.state.userAuthenticated}
          logout={this.logout}
          currentPage={this.state.currentPage}
        />
        <main className="container">
          <Switch>
            <Route
              exact
              path="/"
              render={() => (
                <Home
                  userAuthenticated={this.state.userAuthenticated}
                  userData={this.state.userData}
                  owAPIKey={this.state.owAPIKey}
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

            <Route exact path="/custom_plan" render={() => <CustomPlan />} />

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
                  userAuthenticated={this.state.userAuthenticated}
                  userData={this.state.userData}
                  setCurrentPage={this.setCurrentPage}
                />
              )}
            />

            <Route
              exact
              path="/profile"
              render={() => (
                <Profile
                  userAuthenticated={this.state.userAuthenticated}
                  userData={this.state.userData}
                  refreshUserData={this.refreshUserData}
                  setCurrentPage={this.setCurrentPage}
                />
              )}
            />

            <Route
              exact
              path="/profile/confirm_delete/:id"
              render={({ match }) => (
                <ConfirmDeleteAccount
                  match={match}
                  userData={this.state.userData}
                  logout={this.logout}
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
