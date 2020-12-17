import React, {Component} from 'react';
import {Link} from 'react-router-dom';

class PlanHeader extends Component {
    constructor() {
        super();

        this.state = {

        }
    }

    render() {
        console.log(this.props.key)
        return (
            <React.Fragment>
                <Link to={`/training_plans/${this.props.id}`}>
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
