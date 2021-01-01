import React, {Component} from 'react';
import '../index.css';

class TodaysRun extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
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