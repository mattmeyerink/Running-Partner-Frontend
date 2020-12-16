import React, {Component} from 'react';

// View for the training plan page
class TrainingPlan extends Component {
    constructor() {
        super();

        this.state = {
            training_plans = []
        }
    }

    // Fetch all of the trianing plans from the API when the component mounts
    componentDidMount(){
        fetch()
    }

    render() {
        return (
            <React.Fragment>
                <div className="row justify-content-center">
                    <h1>This page will hold the trianing plans</h1>
                </div>
            </React.Fragment>
        )
    }
}

export default TrainingPlan
