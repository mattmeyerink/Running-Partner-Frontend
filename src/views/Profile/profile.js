import React, {Component} from 'react';
import StatesForm from '../../components/statesForm';
import { Redirect } from 'react-router-dom';
import '../../index.css';

// Class to display the current user's profile
class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            plans: [],
            
            firstName: this.props.userData.first_name,
            lastName: this.props.userData.last_name,
            email: this.props.userData.email,
            username: this.props.userData.username,
            city: this.props.userData.city,
            state: this.props.userData.state,

            editing: false,
            deleting: false

        }

        this.deleteAccount = this.deleteAccount.bind(this);
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

        this.setState({[name]: value});
    }

    // Handle submit of the edit account form
    handleSubmit(event) {
        // Create JSON of edited user data for POST Request
        const editedUserData = {
            id: this.props.userData.id,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            email: this.state.email,
            username: this.state.username,
            city: this.state.city,
            state: this.state.state
        }

        // POST request to update user's data in db
        fetch("http://127.0.0.1:5000/authentication/edit_profile", {
            method: "POST",
            body: JSON.stringify(editedUserData),
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                if (response.status === 200) {
                    // Function to repull user data in the app to have most up to date info
                    this.props.refreshUserData();

                    // Clear the editing state to display user info again
                    this.setState({editing: false});
                }
            })
            .catch(error => console.error(error))

        event.preventDefault()
    }

    // Route to confirmation page to delete account
    deleteAccount() {
        this.setState({deleting: true})
    }

    render () {
        const { first_name, last_name, email, username, city, state, id } = this.props.userData
        return (
            <React.Fragment>
                {this.props.userAuthenticated ?
                <React.Fragment>
                    {this.state.deleting ?
                    <Redirect to={`/profile/confirm_delete/${id}`}/>
                    :
                    <React.Fragment>
                        {this.state.editing? 
                        <React.Fragment>
                            <div className="row justify-content-center">
                                <h1 className="text_shadow">Edit Account Information</h1>
                            </div>
                            <div className="row justify-content-center">
                                <div className="col-md-6 background_color border border-dark edit_profile_padding">
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
                                </div>
                            </div>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <div className="row justify-content-center">
                                <h1 className="text_shadow">{first_name} {last_name}</h1>
                            </div>
                            <div className="row justify-content-center">
                                <button className="btn btn-warning text_spacing" onClick={this.beginEditing}>Edit Account</button>
                                <button className="btn btn-danger text_spacing" onClick={this.deleteAccount}>Delete Account</button>
                            </div>
                            <div className="row justify-content-center">
                                <p className="text_shadow_small"><b>Username:</b> {username}</p>
                            </div>
                            <div className="row justify-content-center">
                                <p className="text_shadow_small"><b>Email:</b> {email}</p>
                            </div>
                            <div className="row justify-content-center">
                                <p className="text_shadow_small"><b>Running Location:</b> {city}, {state}</p>
                            </div>
                        </React.Fragment>
                        }
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
