import React, {Component} from 'react';

class PlanHeader extends Component {
    constructor() {
        super();

        this.state = {

        }
    }

    render() {
        
        return (
            <React.Fragment>
                <div className="col-md-10">
                    <h4>{this.props.race_name} - {this.props.difficulty}</h4>
                    <p>{this.props.plan_length} weeks - {this.props.frequency} runs/week</p>
                </div>
            </React.Fragment>
        )
    }
}

export default PlanHeader
