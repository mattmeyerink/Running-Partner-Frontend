import React, { Component } from 'react';
import '../../index.css';

class GeneralHelp extends Component {
    constructor() {
        super();
        this.state = {

        };
    }

    componentDidMount() {
        // Set the current page to help for the nav bar
        this.props.setCurrentPage("help");
    }

    render() {
        return (
            <React.Fragment>
                <div className="row justify-content-center">
                    <h1 className="white_text">Running Partner Help</h1>
                </div>
                <div className="row">
                    <p>
                        This will we the page for general help and instructions on the app. After
                        watching a few people use this independently I deemed this as necissary lol.
                    </p>
                </div>
            </React.Fragment>
        );
    }
}

export default GeneralHelp;
