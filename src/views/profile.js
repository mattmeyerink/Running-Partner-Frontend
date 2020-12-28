import React, {Component} from 'react';
import { Redirect, Link } from 'react-router-dom';

// Class to display the current user's profile
class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            plans: []
        }
    }

    componentDidMount() {
        // Make API call to gather training plans the user has.
        fetch(`http://127.0.0.1:5000/training_plans/custom_plans/${this.props.userData.id}`)
            .then(response => response.json())
            .then(data => this.setState({plans: data}))
            .catch(error => console.error(error))
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
                            <p>
                                <b>Current Training Plan:</b> 
                                {this.state.plans.map(plan => 
                                <React.Fragment>
                                    <Link to={`/personal_plan/${plan.id}`}>{plan.race_name} - {plan.difficulty}      </Link>
                                </React.Fragment>)}
                            </p>
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
