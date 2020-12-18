import React, {Component} from 'react';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
    
        this.setState({[name]: value})
    }

    handleSubmit(event) {

        event.preventDefault();
    }

    render() {
        return (
            <React.Fragment>
                <div className="row justify-content-center">
                    <h1>This will be the login page</h1>
                </div>

                <div className="row justify-content-center">
                    <div className="col-md-4 ">
                        <form onSubmit={this.handleSubmit}>
                            <input 
                                type="text" 
                                name="username"
                                onChange={this.handleChange}
                                value={this.state.username}
                                placeholder="Username" 
                                className="form-control"
                            />
                            <input 
                                type="password" 
                                name="password"
                                onChange={this.handleChange}
                                value={this.state.password}
                                placeholder="Password" 
                                className="form-control"
                            />
                            <input type="submit" />
                        </form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Login;
