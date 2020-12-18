import React, {Component} from 'react';

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
        fetch(`http://127.0.0.1:5000/training_plans/${this.props.match.params.id}`)
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
                    total += parseInt(days[j]);
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
                <div className="row justify-content-center">
                    <h1>{training_plan.race_name} - {training_plan.difficulty}</h1>
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
        )
    }
}

export default SinglePlan;
