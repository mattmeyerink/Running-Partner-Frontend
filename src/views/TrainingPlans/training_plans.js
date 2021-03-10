import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import PlanHeader from '../../components/plan_header';
import Config from '../../config';

// View for the training plan page
class TrainingPlan extends Component {
    constructor() {
        super();

        this.state = {
            training_plans: []
        }
    }

    // Fetch all of the trianing plans from the API when the component mounts
    componentDidMount(){
        // Set current page to allTraining Plans for the nav bar
        this.props.setCurrentPage("allTrainingPlans");
        
        const myHeaders = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.userData.token,
        });

        fetch(Config.rpAPI + '/training_plans/all_plans', {
            method: 'GET',
            headers: myHeaders
        })
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
                        <h1 className="white_text">Training Plans</h1>
                    </div>

                    <div className="row justify-content-center">
                        {this.state.training_plans.map(
                            plan => (<PlanHeader 
                                        key={plan.id}
                                        id={plan.id}
                                        difficulty={plan.difficulty}
                                        frequency={plan.frequency}
                                        plan_length={plan.plan_length}
                                        race_length={plan.race_length}
                                        race_name={plan.race_name} 
                                    />)
                        )}
                    </div>
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

export default TrainingPlan
