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
import Login from './views/Authentication/login';
import Registration from './views/Authentication/register';
import NavBar from './components/navbar';

// App class to control routing and authentication flow
class App extends Component {
  constructor() {
    super();

    this.state = {
      userAuthenticated: false,
      userData: {}
    }

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.refreshUserData = this.refreshUserData.bind(this);
  }

  // Login the user. Passed to login screen.
  login(data) {
    this.setState({
      userAuthenticated: true,
      userData: data
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
    fetch(`http://127.0.0.1:5000/authentication/get_user_data/${this.state.userData.id}`)
        .then(response => response.json())
        .then(data => this.setState({userData: data}))
        .catch(error => console.error(error))
  }

  render() {
    return (
      <div>
        <NavBar userAuthenticated={this.state.userAuthenticated} logout={this.logout}/>
        <main className="container">
          <Switch>
            <Route exact path = "/" render={() => 
                <Home userAuthenticated={this.state.userAuthenticated} userData={this.state.userData} />
            }/>

            <Route exact path = "/training_plans" render={() => 
                <TrainingPlan userAuthenticated={this.state.userAuthenticated}/>
            }/>

            <Route exact path = "/training_plans/:id" render={({ match }) => 
                <SinglePlan match={match} userAuthenticated={this.state.userAuthenticated}/>
            }/>

            <Route exact path = "/personal_plan" render={() => 
                <MyPlans userAuthenticated={this.state.userAuthenticated} userData={this.state.userData} />
            } />

            <Route exact path = "/personal_plan/:id" render={({ match }) => 
                <PersonalPlan match={match} userData={this.state.userData} refreshUserData={this.refreshUserData}/> 
            } />

            <Route exact path = "/personal_plan/edit/:id" render={({ match }) => 
                <EditPlan match={match} userAuthenticated={this.state.userAuthenticated}
                    userData={this.state.userData} /> 
            } />

            <Route exact path = "/add_plan/:id" render={({ match }) => 
                <AddPlan match={match} userAuthenticated={this.state.userAuthenticated} 
                    userData={this.state.userData}/>
            } />

            <Route exact path = "/all_runs" render={() => 
                <AllRuns userAuthenticated={this.state.userAuthenticated} userData={this.state.userData} /> 
            } />

            <Route exact path = "/profile" render={() => 
                <Profile userAuthenticated={this.state.userAuthenticated} userData={this.state.userData}
                    refreshUserData={this.refreshUserData}/>
            } />

            <Route exact path = "/profile/confirm_delete/:id" render={({ match }) => 
                <ConfirmDeleteAccount logout={this.logout} match={match}/> 
            } />

            <Route exact path = "/login" render={() => 
                <Login login={this.login} userAuthenticated={this.state.userAuthenticated} 
                    userData={this.state.userData}/>
            } />

            <Route exact path = "/registration" render={() => <Registration />} />
          </Switch>
        </main>
      </div>
    );

  }
}

export default App;
