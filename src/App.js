import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './views/home';
import Profile from './views/Profile/profile';
import ConfirmDeleteAccount from './views/Profile/confirm_delete';
import SinglePlan from './views/TrainingPlans/individual_plan';
import TrainingPlan from './views/TrainingPlans/training_plans';
import AddPlan from './views/TrainingPlans/add_training_plan';
import PersonalPlan from './views/MyPlans/personal_plan';
import EditPlan from './views/MyPlans/edit_personal_plan';
import MyPlans from './views/MyPlans/my_plans';
import AllRuns from './views/Runs/all_runs';
import GeneralHelp from './views/Help/generalHelp';
import Login from './views/Authentication/login';
import Registration from './views/Authentication/register';
import NavBar from './components/navbar';
import './index.css';

// App class to control routing and authentication flow
class App extends Component {
  constructor() {
    super();

    this.state = {
      userAuthenticated: false,
      userData: {},
      currentPage: "",
    }

    this.setCurrentPage = this.setCurrentPage.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.refreshUserData = this.refreshUserData.bind(this);
  }

  // Sets the current page to pass to the nav bar
  setCurrentPage(page) {
    this.setState({currentPage: page});
  }

  // Login the user. Passed to login screen.
  login(data) {
    this.setState({
      userAuthenticated: true,
      userData: data,
    })
  }

  // Logout the current user. Passed to logout screen.
  logout() {
    this.setState({
      userAuthenticated: false,
      userData: {}
    })
  }

  // Re pull the user data after an edit in the profile page. Passed to the profile page.
  refreshUserData() {
    const myHeaders = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.state.userData.token,
    });

    fetch(`https://running-partner.herokuapp.com/authentication/get_user_data/${this.state.userData.id}`, {
      method: 'GET',
      headers: myHeaders
    })
        .then(response => response.json())
        .then(data => this.setState({userData: data}))
        .catch(error => console.error(error))
  }

  render() {
    document.body.style.backgroundColor = "#323232";
    return (
      <div>
        <NavBar userAuthenticated={this.state.userAuthenticated} logout={this.logout} currentPage={this.state.currentPage} />
        <main className="container">
          <Switch>
            <Route exact path = "/" render={() => 
                <Home userAuthenticated={this.state.userAuthenticated} userData={this.state.userData} 
                    owAPIKey={this.state.owAPIKey} setCurrentPage={this.setCurrentPage} />
            }/>

            <Route exact path = "/training_plans" render={() => 
                <TrainingPlan userAuthenticated={this.state.userAuthenticated} userData={this.state.userData}
                    setCurrentPage={this.setCurrentPage} />
            }/>

            <Route exact path = "/training_plans/:id" render={({ match }) => 
                <SinglePlan match={match} userAuthenticated={this.state.userAuthenticated} 
                    userData={this.state.userData} setCurrentPage={this.setCurrentPage} />
            }/>

            <Route exact path = "/personal_plan" render={() => 
                <MyPlans userAuthenticated={this.state.userAuthenticated} userData={this.state.userData} 
                    setCurrentPage={this.setCurrentPage} />
            } />

            <Route exact path = "/personal_plan/:id" render={({ match }) => 
                <PersonalPlan match={match} userData={this.state.userData} 
                    refreshUserData={this.refreshUserData} setCurrentPage={this.setCurrentPage} /> 
            } />

            <Route exact path = "/personal_plan/edit/:id" render={({ match }) => 
                <EditPlan match={match} userAuthenticated={this.state.userAuthenticated}
                    userData={this.state.userData} setCurrentPage={this.setCurrentPage} /> 
            } />

            <Route exact path = "/add_plan/:id" render={({ match }) => 
                <AddPlan match={match} userAuthenticated={this.state.userAuthenticated} 
                    userData={this.state.userData} setCurrentPage={this.setCurrentPage} />
            } />

            <Route exact path = "/all_runs" render={() => 
                <AllRuns userAuthenticated={this.state.userAuthenticated} userData={this.state.userData} 
                    setCurrentPage={this.setCurrentPage} /> 
            } />

            <Route exact path = "/profile" render={() => 
                <Profile userAuthenticated={this.state.userAuthenticated} userData={this.state.userData}
                    refreshUserData={this.refreshUserData} setCurrentPage={this.setCurrentPage} />
            } />

            <Route exact path = "/profile/confirm_delete/:id" render={({ match }) => 
                <ConfirmDeleteAccount logout={this.logout} match={match} 
                    userData={this.state.userData} setCurrentPage={this.setCurrentPage} /> 
            } />

            <Route exact path = "/help" render={() => <GeneralHelp setCurrentPage={this.setCurrentPage}/>} />

            <Route exact path = "/login" render={() => 
                <Login login={this.login} userAuthenticated={this.state.userAuthenticated} 
                    userData={this.state.userData} setCurrentPage={this.setCurrentPage} />
            } />

            <Route exact path = "/registration" render={() => <Registration />} setCurrentPage={this.setCurrentPage} />
          </Switch>
        </main>
      </div>
    );
  }
}

export default App;
