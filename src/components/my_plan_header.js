import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash} from '@fortawesome/free-solid-svg-icons';
import './components.css';

class MyPlanHeader extends Component {
    constructor() {
        super();

        this.state = {

        }

        this.deletePlan = this.deletePlan.bind(this);
    }

    // Deletes a custom plan from the db
    deletePlan() {
        fetch(`http://127.0.0.1:5000/training_plans/custom_plan/delete/${this.props.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                if (response.status === 200) {
                    this.props.getTrainingPlans();
                }
            })
            .catch(error => console.error(error))
    }

    render() {
        var planSplit = this.props.plan.split("-")
        var startDate = planSplit[0].split(",")[0]
        var endDate = planSplit[planSplit.length - 1].split(",")[0]

        return (
            <React.Fragment>
                <div className="col-md-8 border border-secondary training_plan_card">
                    <div className="row">
                        <div className="col-md-11">
                            <Link to={`/personal_plan/${this.props.id}`}>
                                <h5>{this.props.race_name} - {this.props.difficulty}</h5>
                            </Link>
                        </div>
                        <div className="col-md-1">
                            <button className="icon_button" onClick={this.deletePlan}>
                                <FontAwesomeIcon icon={faTrash} color="red"/>
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-10">
                            <p>Week of <b>{startDate}</b> through the week of <b>{endDate}</b></p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default MyPlanHeader