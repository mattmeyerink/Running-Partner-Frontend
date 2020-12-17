import React, {Component} from 'react';
import PlanHeader from '../components/plan_header';

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
        fetch('http://127.0.0.1:5000/training_plans/all_plans')
            .then(result => result.json())
            .then(data => this.setState({training_plans: data}))
            .catch(error => console.error(error))
    }

    render() {
        return (
            <React.Fragment>
                <div className="row justify-content-center">
                    <h1>Training Plans</h1>
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
        )
    }
}

export default TrainingPlan
