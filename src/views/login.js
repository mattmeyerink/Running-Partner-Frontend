import React, {Component} from 'react';
import '../index.css';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
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
                <div className="row">
                    <div className="col-md-4 offset-4 border border-dark login_input_box">
                        <div className="row justify-content-center">
                            <h1>Login</h1>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <input 
                                type="text" 
                                name="email"
                                onChange={this.handleChange}
                                value={this.state.username}
                                placeholder="Email" 
                                className="form-control form_spacing"
                            />
                            <input 
                                type="password" 
                                name="password"
                                onChange={this.handleChange}
                                value={this.state.password}
                                placeholder="Password" 
                                className="form-control form_spacing"
                            />
                            <input type="submit" className="form-control btn btn-success" />
                        </form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Login;
