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
        return (
            <React.Fragment>
                <h1>This will the the page for an individual training plan.</h1>
            </React.Fragment>
        )
    }
}

export default SinglePlan;
