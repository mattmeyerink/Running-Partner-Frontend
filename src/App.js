import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './views/home';
import TrainingPlan from './views/training_plans';
import Profile from './views/profile';
import NavBar from './components/navbar';
import SinglePlan from './views/individual_plan';
import Login from './views/login';
import Registration from './views/register';

// App class to control routing and authentication flow
class App extends Component {
  constructor() {
    super();

    this.state = {
      userAuthenticated: false
    }
  }

  render() {
    return (
      <React.Fragment>
        <NavBar />
        <main className="continaer">
          <Switch>
            <Route exact path = "/" render={() => <Home />} />
            <Route exact path = "/training_plans" render={() => <TrainingPlan />} />
            <Route exact path = "/training_plans/:id" render={({ match }) => <SinglePlan match={match} />} />
            <Route exact path = "/profile" render={() => <Profile />} />
            <Route exact path = "/login" render={() => <Login userAuthenticated={this.state.userAuthenticated} />} />
            <Route exact path = "/registration" render={() => <Registration />} />
          </Switch>
        </main>
      </React.Fragment>
    );

  }
}

export default App;
