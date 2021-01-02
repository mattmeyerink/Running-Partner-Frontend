import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './components.css';

class MyPlanHeader extends Component {
    constructor() {
        super();

        this.state = {

        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="col-md-8 border border-secondary training_plan_card">
                    <Link to={`/personal_plan/${this.props.id}`}>
                        <div className="row">
                            <div className="col-md-6">
                                <strong>{this.props.race_name} - {this.props.difficulty}</strong>
                            </div>
                            <div className="col-md-3 offset-3">
                                <p>Delete Plan icon</p>
                            </div>
                        </div>
                        
                    </Link>
                </div>
            </React.Fragment>
        )
    }
}

export default MyPlanHeader