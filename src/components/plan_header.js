import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import SinglePlan from '../views/individual_plan';

class PlanHeader extends Component {
    constructor() {
        super();

        this.state = {

        }
    }

    render() {
        
        return (
            <React.Fragment>
                <Link to={`/training_plans/${this.props.key}`}>
                    <div className="col-md-10">
                        <h4>{this.props.race_name} - {this.props.difficulty}</h4>
                        <p>{this.props.plan_length} weeks - {this.props.frequency} runs/week</p>
                    </div>
                </Link>
            </React.Fragment>
        )
    }
}

export default PlanHeader
