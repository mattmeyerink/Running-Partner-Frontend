import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom';
import MyPlanHeader from '../../components/my_plan_header';

class MyPlans extends Component {
    constructor(props) {
        super(props);

        this.state = {
            training_plans: [],
            loading: true,
            planDeleted: false
        }

        this.getTrainingPlans = this.getTrainingPlans.bind(this);
        this.getActivePlan = this.getActivePlan.bind(this);
    }

    componentDidMount(){
        const myHeaders = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.userData.token,
        });

        fetch(`https://running-partner.herokuapp.com/training_plans/custom_plans/${this.props.userData.id}`, {
            method: 'GET',
            headers: myHeaders
        })
            .then(result => result.json())
            .then(data => this.setState({training_plans: data, loading: false}))
            .catch(error => console.error(error))
    }

    // Method to pass down to plan headers to re gather plan info when a plan is deleted
    getTrainingPlans() {
        const myHeaders = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.userData.token,
        });

        fetch(`https://running-partner.herokuapp.com/training_plans/custom_plans/${this.props.userData.id}`, {
            method: 'GET',
            headers: myHeaders
        })
            .then(result => result.json())
            .then(data => this.setState({training_plans: data}))
            .catch(error => console.error(error))
    }

    // Return the active plan data out of all of the training plans
    getActivePlan() {
        if (!this.state.loading) {
            const trainingPlan = this.state.training_plans
            for (let i = 0; i < trainingPlan.length; i++) {
                if (trainingPlan[i].id === this.props.userData.active_plan) {
                    return trainingPlan[i];
                }
            }
        }
        return null;
    }

    render() {
        const activePlan = this.getActivePlan();

        return (
            <React.Fragment>
                {this.props.userAuthenticated ?
                <React.Fragment>
                    <div className="row justify-content-center">
                        <h1 className="white_text">My Plans</h1>
                    </div>
                    {this.state.training_plans.length === 0?
                    <React.Fragment>
                        <div className="row justify-content-center">
                            <h3 className="white_text">You are not currently signed up for any training plans.</h3>
                        </div>
                        <div className="row justify-content-center">
                            <h3 className="white_text">Sign up for a plan <Link to="/training_plans">here</Link>!</h3>
                        </div>
                    </React.Fragment>
                    
                    :
                    <React.Fragment>
                        {activePlan !== null ?
                        <React.Fragment>
                            <div className="row">
                                <div className="offset-2">
                                    <h3 className="white_text">My Active Plan</h3>
                                </div>
                            </div>
                            <div className="row justify-content-center">
                                <MyPlanHeader 
                                    key={activePlan.id}
                                    id={activePlan.id}
                                    difficulty={activePlan.difficulty}
                                    plan_length={activePlan.plan_length}
                                    race_name={activePlan.race_name} 
                                    plan={activePlan.plan}
                                    getTrainingPlans={this.getTrainingPlans}
                                />
                            </div>
                        </React.Fragment>
                        :
                        <React.Fragment>
                        </React.Fragment>
                    }
                    <div className="row">
                        <div className="offset-2">
                            <h3 className="white_text">Saved Plans</h3>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                    {this.state.training_plans.map(
                        plan => ( 
                                <React.Fragment key={plan.id}>
                                    {plan.id === this.props.userData.active_plan?
                                    <React.Fragment>
                                    </React.Fragment>
                                    :
                                    <MyPlanHeader 
                                        key={plan.id}
                                        id={plan.id}
                                        difficulty={plan.difficulty}
                                        plan_length={plan.plan_length}
                                        race_name={plan.race_name} 
                                        plan={plan.plan}
                                        getTrainingPlans={this.getTrainingPlans}
                                    />
                                    }
                                </React.Fragment>
                        )
                        )}
                    </div>
                    </React.Fragment>
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
