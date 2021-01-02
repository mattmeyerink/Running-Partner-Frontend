import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';

// Class to display the current user's profile
class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            plans: []
        }
    }

    render () {
        const { first_name, last_name, email, username, city, state } = this.props.userData
        return (
            <React.Fragment>
                {this.props.userAuthenticated ?
                <React.Fragment>
                        <div className="row">
                            <h1>{first_name} {last_name}</h1>
                        </div>
                        <div className="row">
                            <p><b>Username:</b> {username}</p>
                        </div>
                        <div className="row">
                            <p><b>Email:</b> {email}</p>
                        </div>
                        <div className="row">
                            <p><b>Running Location:</b> {city}, {state}</p>
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
