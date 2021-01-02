import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './components.css';

// Navbar to be displayed on every page
class NavBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        }
    }

    render() {
        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link className="navbar-brand" to="/">Running Partner</Link>
                
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/personal_plan">My Training Plans</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/all_runs">My Runs</Link>
                            </li>
                            <li className="nav-item active">
                                <Link className="nav-link" to="/training_plans">Training Plans<span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/profile">Profile</Link>
                            </li>
                        </ul>
                        {this.props.userAuthenticated ?
                        <button className="btn btn-light" onClick={this.props.logout}>Logout</button>
                        :
                        <React.Fragment>
                            <Link to="/login" className="btn btn-light">Login</Link>
                            <Link to="/registration" className="btn btn-light registration_btn">Register</Link>
                        </React.Fragment>
                        }
                        
                    </div>
                </nav>
            </React.Fragment>
        )
    }
}

export default NavBar;
