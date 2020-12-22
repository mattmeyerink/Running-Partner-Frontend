import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';

// Class to display the current user's profile
class Profile extends Component {
    constructor() {
        super()

        this.state = {

        }
    }

    render () {
        return (
            <React.Fragment>
                {this.props.userAuthenticated ?
                <React.Fragment>
                    <div className="row justify-content-center">
                        <h1>This will the the user's profile page!</h1>
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

export default Profile
