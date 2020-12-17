import React, {Component} from 'react';

class SinglePlan extends Component {
    constructor() {
        super();

        this.state = {
            difficulty: "",
            frequency: "",
            plan_length: "",
            race_length: "",
            race_name: "",
            plan: "",
            planArr: []
        }
    }

    // Get the plan data for a single training plan
    componentDidMount() {
        // Make the API call
        fetch(`http://127.0.0.1:5000/training_plans/${this.props.match.params.id}`)
            .then(result => result.json())
            .then(data => this.setState({
                difficulty: data["difficulty"],
                frequency: data["frequency"],
                plan_length: data["plan_length"],
                race_length: data["race_length"],
                race_name: data["race_name"],
                plan: data["plan"]
            }))
            .catch(error => console.error(error))

        // Convert the plan into an array to be printed
        var planStr = this.state.plan;
        var outputPlan = []
        
        // Split the plan string in to each week (denominated by a -)
        var weeksPlan = planStr.split("-");

        for (var i = 0; i < weeksPlan.length; i++) {
            var weekPlanOutput = [];
            // Split the weeks plan into each day (broken up by commas)
            var dailyPlan = weeksPlan[i].split(",");

            // Add each day's value to an output array for the week
            for (var j = 0; j < dailyPlan.length; j++) {
                weekPlanOutput.push(dailyPlan[j]);
            }

            // Push that output to the plan array
            outputPlan.push(weekPlanOutput);
        }

        // Update state with the plan array
        this.setState({planArr: outputPlan});
    }

    render() {
        console.log(this.state.planArr)
        return (
            <React.Fragment>
                <div className="row justify-content-center">
                    <h1>{this.state.race_name} - {this.state.difficulty}</h1>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <table className="table">
                            <tr>
                                <th>Monday</th>
                                <th>Tuesday</th>
                                <th>Wednesday</th>
                                <th>Thursday</th>
                                <th>Friday</th>
                                <th>Saturday</th>
                                <th>Sunday</th>
                            </tr>
                            {this.state.planArr.map(week => (
                                <tr>
                                    <td>{week[0]}</td>
                                    <td>{week[1]}</td>
                                    <td>{week[2]}</td>
                                    <td>{week[3]}</td>
                                    <td>{week[4]}</td>
                                    <td>{week[5]}</td>
                                    <td>{week[6]}</td>
                                </tr>
                            ))}
                        </table>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default SinglePlan;
