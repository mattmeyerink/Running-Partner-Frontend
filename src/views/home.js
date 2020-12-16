import React, {Component} from 'react';

// view for the homepage
class Home extends Component {
    constructor() {
        super();

        this.state = {

        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="row justify-content-center">
                    <h1>This will be the home screen!</h1>
                </div>
            </React.Fragment>
        )
    }
}

export default Home
