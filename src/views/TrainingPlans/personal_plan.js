import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import '../../index.css';

// View to display a personal training plan
class PersonalPlan extends Component {
    constructor(props) {
        super(props)

        this.state = {
            planData: {},
            planDeleted: false,
            editingPlan: false
        }

        this.convertToTable = this.convertToTable.bind(this);
        this.deletePlan = this.deletePlan.bind(this);
        this.editPlan = this.editPlan.bind(this);
    }

    componentDidMount(){
        fetch(`http://127.0.0.1:5000/training_plans/custom_plan/${this.props.match.params.id}`)
            .then(response => response.json())
            .then(data => this.setState({planData: data}))
            .catch(error => console.error(error))
    }

    // Converts the plan in state to an array that can be mapped to a table when rendered
    convertToTable() {
        var planOutput = []

        // If the plan has been pulled from the API, handle the data
        if (this.state.planData.plan !== undefined) {
            const plan = this.state.planData.plan;
            var weeks = plan.split("-");

            for (var i = 0; i < weeks.length; i++) {
                var days = weeks[i].split(",");
                var weekOutput = [];
                var total = 0;
                for (var j = 0; j < days.length; j++) {
                    weekOutput.push(days[j]);
                    total += parseInt(days[j]);
                }
                weekOutput.push(total);
                planOutput.push(weekOutput);
            }
        }
        return planOutput
    }

    deletePlan() {
        fetch(`http://127.0.0.1:5000/training_plans/custom_plan/delete/${this.state.planData.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({planDeleted: true})
                }
            })
            .catch(error => console.error(error))
    }

    editPlan() {
        this.setState({editingPlan: true});
    }

    render() {
        const training_plan = this.state.planData;
        const planData = this.convertToTable();
        return (
            <React.Fragment>
                {this.state.editingPlan ?
                    <Redirect to={`/personal_plan/edit/${this.props.match.params.id}`} />
                    :
                    <React.Fragment>
                {this.state.planDeleted ?
                <Redirect to={"/profile"} />
                :
                    <React.Fragment>
                        <div className="row justify-content-center">
                            <h1>{training_plan.race_name} - {training_plan.difficulty}</h1>
                        </div>
                        <div className="row justify-content-center">
                            <button onClick={this.deletePlan} className="btn btn-danger button_spacing">Delete Plan</button>
                            <button onClick={this.editPlan} className="btn btn-warning button_spacing">Edit Plan</button>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-10">
                                <table className="table">
                                    <tbody>
                                        <tr>
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
                                                    <td>{week[0]}</td>
                                                    <td>{week[1]}</td>
                                                    <td>{week[2]}</td>
                                                    <td>{week[3]}</td>
                                                    <td>{week[4]}</td>
                                                    <td>{week[5]}</td>
                                                    <td>{week[6]}</td>
                                                    <td><b>{week[7]}</b></td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </React.Fragment>
                    }
                </React.Fragment>
                }
            </React.Fragment>
            
            
        )
    }
}

export default PersonalPlan;
