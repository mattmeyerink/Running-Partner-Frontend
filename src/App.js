import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './views/home';
import Profile from './views/profile';
import SinglePlan from './views/TrainingPlans/individual_plan';
import TrainingPlan from './views/TrainingPlans/training_plans';
import AddPlan from './views/TrainingPlans/add_training_plan';
import PersonalPlan from './views/TrainingPlans/personal_plan';
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
  }

  login(data) {
    this.setState({
      userAuthenticated: true,
      userData: data
    })
  }

  logout() {
    this.setState({
      userAuthenticated: false,
      userData: {}
    })
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

            <Route exact path = "/personal_plan" render={() => <PersonalPlan /> } />

            <Route exact path = "/add_plan" render={() => <AddPlan /> } />

            <Route exact path = "/profile" render={() => 
                <Profile userAuthenticated={this.state.userAuthenticated} userData={this.state.userData}/>
            }/>

            <Route exact path = "/login" render={() => 
                <Login login={this.login} userAuthenticated={this.state.userAuthenticated} 
                    userData={this.state.userData}/>
            }/>

            <Route exact path = "/registration" render={() => <Registration />} />
          </Switch>
        </main>
      </div>
    );

  }
}

export default App;
