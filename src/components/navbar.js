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
        const { currentPage } = this.props;
        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg  navbar-dark navbar_custom">
                    <Link className="navbar-brand" to="/">Running Partner</Link>
                
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className={currentPage==="myTrainingPlans" ? "nav-item active" : "nav-item"} >
                                <Link className="nav-link" to="/personal_plan">My Training Plans</Link>
                            </li>
                            <li className={currentPage==="myRuns" ? "nav-item active" : "nav-item"}>
                                <Link className="nav-link" to="/all_runs">My Runs</Link>
                            </li>
                            <li className={currentPage==="allTrainingPlans" ? "nav-item active" : "nav-item"}>
                                <Link className="nav-link" to="/training_plans">Training Plans</Link>
                            </li>
                            <li className={currentPage==="profile" ? "nav-item active" : "nav-item"}>
                                <Link className="nav-link" to="/profile">Profile</Link>
                            </li>
                            <li className={currentPage==="help" ? "nav-item active" : "nav-item"}>
                                <Link className="nav-link" to="/help">Help</Link>
                            </li>
                        </ul>
                        {this.props.userAuthenticated ?
                        <button className="btn btn-secondary" onClick={this.props.logout}>Logout</button>
                        :
                        <React.Fragment>
                            <Link to="/login" className="btn btn-secondary">Login</Link>
                            <Link to="/registration" className="btn btn-secondary registration_btn">Register</Link>
                        </React.Fragment>
                        }
                    </div>
                </nav>
            </React.Fragment>
        )
    }
}

export default NavBar;
