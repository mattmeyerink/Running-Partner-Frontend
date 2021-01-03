import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import MyPlanHeader from '../../components/my_plan_header';

class MyPlans extends Component {
    constructor(props) {
        super(props);

        this.state = {
            training_plans: [],
            planDeleted: false
        }

        this.getTrainingPlans = this.getTrainingPlans.bind(this);
    }

    componentDidMount(){
        fetch(`http://127.0.0.1:5000/training_plans/custom_plans/${this.props.userData.id}`)
            .then(result => result.json())
            .then(data => this.setState({training_plans: data}))
            .catch(error => console.error(error))
    }

    // Method to pass down to plan headers to re gather plan info when a plan is deleted
    getTrainingPlans() {
        fetch(`http://127.0.0.1:5000/training_plans/custom_plans/${this.props.userData.id}`)
            .then(result => result.json())
            .then(data => this.setState({training_plans: data}))
            .catch(error => console.error(error))
    }

    render() {
        return (
            <React.Fragment>
                {this.props.userAuthenticated ?
                <React.Fragment>
                    <div className="row justify-content-center">
                        <h1>My Plans</h1>
                    </div>
                    {this.state.training_plans.length === 0?
                    <React.Fragment>
                        <div className="row justify-content-center">
                            <h3>You are not currently signed up for any training plans.</h3>
                        </div>
                        <div className="row justify-content-center">
                            <h3>Sign up for a plan <Link to="/training_plans">here</Link>!</h3>
                        </div>
                    </React.Fragment>
                    
                    :
                    <div className="row justify-content-center">
                    {this.state.training_plans.map(
                        plan => (<MyPlanHeader 
                                    key={plan.id}
                                    id={plan.id}
                                    difficulty={plan.difficulty}
                                    plan_length={plan.plan_length}
                                    race_name={plan.race_name} 
                                    plan={plan.plan}
                                    getTrainingPlans={this.getTrainingPlans}
                                />)
                        )}
                    </div>
                    }
                    
                </React.Fragment> 
                :
                <React.Fragment>
                    <Redirect to="/login" />
                </React.Fragment>
                }
            </React.Fragment>
        )
    }
}

export default MyPlans;
