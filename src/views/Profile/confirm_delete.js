import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

class ConfirmDeleteAccount extends Component {
    constructor() {
        super();

        this.state = {
            accountDeleted: false
        }

        this.deleteAccount = this.deleteAccount.bind(this);
    }

    // Method to handle delete account
    deleteAccount() {
        const myHeaders = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.props.userData.token,
        });

        fetch(`http://127.0.0.1:5000/authentication/delete_account/${this.props.match.params.id}`, {
            method: "DELETE",
            headers: myHeaders
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({accountDeleted: true});
                    this.props.logout();
                }
            })
            .catch(error => console.error(error))
    }

    render() {
        return (
            <React.Fragment>
                {this.state.accountDeleted ?
                <Redirect to="/login" />
                :
                <React.Fragment>
                    <div className="row justify-content-center">
                        <h1>Are you sure you want to delete your account?</h1>
                    </div>
                    <div className="row justify-content-center">
                    <h1>All data associated with it will be lost.</h1>
                    </div>
                    <div className="row justify-content-center">
                        <button className="btn btn-danger" onClick={this.deleteAccount}>Delete Account</button>
                    </div>
                </React.Fragment>
                }
            </React.Fragment>
        )
    }
}

export default ConfirmDeleteAccount;
