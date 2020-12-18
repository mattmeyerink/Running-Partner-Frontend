import React, {Component} from 'react';

class Registration extends Component {
    constructor() {
        super();

        this.state = {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            password2:"" 
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }

    handleSubmit(event) {
        console.log(this.state);

        event.preventDefault();
    }

    render() {
        return (
            <React.Fragment>
                <div className="row justify-content-center">
                    <h1>This will be the registration page</h1>
                </div>

                <div className="row justifiy-content-center">
                    <div className="col-md-4 offset-4">
                        <form onSubmit={this.handleSubmit}>
                            <input type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} className="form-control" placeholder="First Name" />
                            <input type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} className="form-control" placeholder="Last Name" />
                            <input type="text" name="username" value={this.state.username} onChange={this.handleChange} className="form-control" placeholder="Username" />
                            <input type="text" name="email" value={this.state.email} onChange={this.handleChange} className="form-control" placeholder="Email" />
                            <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="form-control" placeholder="Password" />
                            <input type="password" name="password2" value={this.state.password2} onChange={this.handleChange} className="form-control" placeholder="Retype Password" />
                            <input type="submit"/>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Registration;
