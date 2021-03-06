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
            <div className="white_text">
                <div className="row justify-content-center">
                    <h1 className="white_text">Running Partner Help</h1>
                </div>
                <div className="row">
                    <p>
                        Welcome to Running Partner! This is the general help section of the site. We hope
                        it answers any and all questions you may have about the site and its use. If 
                        there are remaing questions or comments about the site or you would like to talk about Harry 
                        Potter or running feel free to reach out to meyerink@umich.edu!
                    </p>

                    <h3>General Information</h3>
                    <p>
                        This site is intended to be a one stop shop for your running training organization.
                        Running Partner allows you to add and create your running training plans to prepare
                        for future runs as well as track vital information about the runs you have already
                        completed. Only looking at both the future and the past of your training can you
                        see the full picture. We hope that is what this app provides for you!
                    </p>

                    <h3>Registration</h3>
                    <p>
                        The information you provide during your registration to Running Partner will 
                        never be sold or distrubuted for any purposes. We only collect the information
                        necissary to provide the best experience on the app. During registration you 
                        will be asked to provide a city and state. This is requried for the weather and 
                        run journal portion of the application. Weather will automatically be loaded 
                        for your chosen city and the run log form will automatically populated with this city.
                        We suggest providing the city you most frequently run from, however this can always be 
                        changed app-wide through your profile or in the run log form. 
                    </p>

                    <h3>The Dashboard</h3>
                    <p>
                        Upon login the page automatically loads into the dashboard. The dashboard contains
                        three key widgets to interact with your running data. On the far left is the weather 
                        widget, which displays the current weather for your default city. The far right is a 
                        widget to log a run with field for run length, run location, and any notes you may
                        want to include. In the middle is a widget containing information about any runs you may 
                        have planned for the day. When you first login this will display as a rest day. Once 
                        you select a training plan, any day you have a run scheduled, the widget will display the 
                        amount you are scheduled to run that day. 
                    </p>
                </div>
            </div>
        );
    }
}

export default GeneralHelp;
