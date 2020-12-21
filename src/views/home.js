import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

// view for the homepage
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <React.Fragment>
                {this.props.userAuthenticated ?
                <React.Fragment>
                    <div className="row justify-content-center">
                        <h1>This will be the home screen!</h1>
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

export default Home
