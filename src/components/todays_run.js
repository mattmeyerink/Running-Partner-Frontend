import React, {Component} from 'react';
import moment from 'moment';
import '../index.css';

class TodaysRun extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activePlan: false,
            planData: {}
        }

        this.getTodaysRun = this.getTodaysRun.bind(this);
    }

    // Pull the data for the person's current run
    componentDidMount() {
        if (this.props.userData.active_plan !== -1) {
            fetch(`http://127.0.0.1:5000/training_plans/custom_plan/${this.props.userData.active_plan}`)
            .then(response => response.json())
            .then(data => this.setState({
                planData: data,
                activePlan: true
            }))
            .catch(error => console.error(error))
        }
    }

    // Get todays run length from active plan
    getTodaysRun() {
        if (this.state.activePlan) {
            // Pull the active plan from state and create a week by week array
            var activePlan = this.state.planData.plan;
            var activePlanArr = activePlan.split("-");

            // Get the start date of the first week and the last week
            var firstWeekStart = activePlanArr[0].split(",")[0];
            var lastWeekStart = activePlanArr[activePlanArr.length - 1].split(',')[0];

            // Split dates in array to use in creating moment objects
            var firstWeekStartArr = firstWeekStart.split("/");
            var lastWeekStartArr = lastWeekStart.split("/");

            // Create moment objects with first and last week moments
            var firstWeekStartMoment = moment({ 
                year: parseInt(firstWeekStartArr[2]),
                month: parseInt(firstWeekStartArr[0] - 1),
                day: parseInt(firstWeekStartArr[1])
            })
            var lastWeekStartMoment = moment({
                year: parseInt(lastWeekStartArr[2]),
                month: parseInt(lastWeekStartArr[0] - 1),
                day: parseInt(lastWeekStartArr[1])
            })

            // Calculate the plan end date
            var endDateMoment = lastWeekStartMoment.add(6, "days");
        }
    }

    render() {
        this.getTodaysRun();
        return (
            <React.Fragment>
                <div className="row justify-content-center">
                    <div className="border border-dark weather_card">
                        <h3>This will be the data for today's run</h3>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default TodaysRun;