import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './views/home';
import TrainingPlan from './views/training_plans';
import Profile from './views/profile';
import NavBar from './components/navbar';

// App class to control routing and authentication flow
class App extends Component {
  constructor() {
    super();

    this.state = {

    }
  }

  render() {
    return (
      <React.Fragment>
        <NavBar />
        <main className="continaer">
          <Switch>
            <Route exact path = "/" render={() => <Home />}/>
            <Route exact path = "/training_plans" render={() => <TrainingPlan />}/>
            <Route exact path = "/profile" render={() => <Profile />}/>
          </Switch>
        </main>
      </React.Fragment>
    );

  }
}

export default App;
