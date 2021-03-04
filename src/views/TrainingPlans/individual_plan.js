import React, {Component} from 'react';
import { Redirect, Link } from 'react-router-dom';
import '../../index.css'

class SinglePlan extends Component {
    constructor() {
        super();

        this.state = {
            training_plan: {},
            planDetails: []
        }

        this.convertToTable = this.convertToTable.bind(this)
    }

    // Get the plan data for a single training plan
    componentDidMount() {
        // Set current page to allTraining Plans for the nav bar
        this.props.setCurrentPage("allTrainingPlans");
        
        const myHeaders = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.userData.token,
        });

        fetch(`https://running-partner.herokuapp.com/training_plans/${this.props.match.params.id}`, {
            method: 'GET',
            headers: myHeaders
        })
            .then(result => result.json())
            .then(data => this.setState({training_plan: data}))
            .catch(error => console.error(error))
    }

    // Converts the plan in state to an array that can be mapped to a table when rendered
    convertToTable() {
        var planOutput = []

        // If the plan has been pulled from the API, handle the data
        if (this.state.training_plan.plan !== undefined) {
            const plan = this.state.training_plan.plan;
            var weeks = plan.split("-");

            for (var i = 0; i < weeks.length; i++) {
                var days = weeks[i].split(",");
                var weekOutput = [];
                var total = 0;
                for (var j = 0; j < days.length; j++) {
                    weekOutput.push(days[j]);
                    total += parseFloat(days[j]);
                }
                weekOutput.push(total);
                planOutput.push(weekOutput);
            }
        }

        return planOutput
    }

    render() {
        const training_plan = this.state.training_plan;
        const planData = this.convertToTable();
        return (
            <React.Fragment>
                {this.props.userAuthenticated ?
                <React.Fragment>
                <div className="row justify-content-center">
                    <h1 className="white_text">{training_plan.race_name} - {training_plan.difficulty}</h1>
                </div>
                <div className="row justify-content-center">
                    <Link to={`/add_plan/${training_plan.id}`} className="btn btn-success form_spacing">Use Plan</Link>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <table className="table background_color">
                            <tbody>
                                <tr>
                                    <th>Week</th>
                                    <th>Monday</th>
                                    <th>Tuesday</th>
                                    <th>Wednesday</th>
                                    <th>Thursday</th>
                                    <th>Friday</th>
                                    <th>Saturday</th>
                                    <th>Sunday</th>
                                    <th>Total</th>
                                </tr>
                                {planData.map((week, index) => (
                                    <React.Fragment key={index}>
                                        <tr>
                                            <td><b>{index + 1}</b></td>
                                            <td>{week[0]}</td>
                                            <td>{week[1]}</td>
                                            <td>{week[2]}</td>
                                            <td>{week[3]}</td>
                                            <td>{week[4]}</td>
                                            <td>{week[5]}</td>
                                            <td>{week[6]}</td>
                                            <td><b>{(week[7]).toFixed(1)}</b></td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
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

export default SinglePlan;
