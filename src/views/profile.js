import React, {Component} from 'react';
import StatesForm from '../components/statesForm';
import { Redirect } from 'react-router-dom';

// Class to display the current user's profile
class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            plans: [],
            editing: false,
            first_name: this.props.first_name,
            last_name: this.props.last_name,
            email: this.props.email,
            username: this.props.username,
            city: this.props.city,
            state: this.props.state
        }

        this.beginEditing = this.beginEditing.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Set state to begin editing
    beginEditing() {
        this.setState({editing: true});
    }

    // Handle change to edit account form
    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({name: value});
    }

    // Handle submit of the edit account form
    handleSubmit(event) {

    }

    render () {
        const { first_name, last_name, email, username, city, state } = this.props.userData
        return (
            <React.Fragment>
                {this.props.userAuthenticated ?
                <React.Fragment>
                        {this.editing? 
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} className="form-control form_spacing" placeholder="First Name" />
                                <input type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} className="form-control form_spacing" placeholder="Last Name" />
                                <input type="text" name="username" value={this.state.username} onChange={this.handleChange} className="form-control form_spacing" placeholder="Username" />
                                <input type="text" name="email" value={this.state.email} onChange={this.handleChange} className="form-control form_spacing" placeholder="Email" />
                                <input type="text" name="city" value={this.state.city} onChange={this.handleChange} className="form-control form_spacing" placeholder="City" />
                                <select name="state" value={this.state.state} onChange={this.handleChange} className="form-control form_spacing">
                                    <StatesForm />
                                </select>
                                <input type="submit" className="btn btn-success form-control"/>
                        </form>
                        :
                        <React.Fragment>
                            <div className="row">
                                <h1>{first_name} {last_name}</h1>
                            </div>
                            <div className="row">
                                <button className="btn btn-warning" onClick={this.beginEditing}>Edit Account</button>
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
                        }
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
