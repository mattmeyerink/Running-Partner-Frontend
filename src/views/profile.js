import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';

// Class to display the current user's profile
class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render () {
        const { first_name, last_name, email, username, city, state } = this.props.userData
        return (
            <React.Fragment>
                {this.props.userAuthenticated ?
                <React.Fragment>
                        <div class="row">
                            <h1>{first_name} {last_name}</h1>
                        </div>
                        <div class="row">
                            <p><b>Username:</b> {username}</p>
                        </div>
                        <div class="row">
                            <p><b>Email:</b> {email}</p>
                        </div>
                        <div class="row">
                            <p><b>Running Location:</b> {city}, {state}</p>
                        </div>
                        <div class="row">
                            <p><b>Current Training Plan:</b></p>
                        </div>
                        <div class="row">
                            <p><b>Lifetime Mileage:</b></p>
                        </div>
                        <div class="row">
                            <p><b>Miles this Month:</b></p>
                        </div>
                        <div class="row">
                            <p><b>Miles this Week:</b></p>
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
