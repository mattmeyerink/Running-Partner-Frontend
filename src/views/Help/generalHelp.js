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

                    <h3>Training Plans</h3>
                    <p>
                        When you first login to the app you will have no training plans currently 
                        associated with your account. Fear not! Adding training plans to your account
                        is easy! To add a training plan to your account navigate to the "Training Plans"
                        page in the navigation bar. On this page you will see there are tons of plans to 
                        chose from! Select the plan that appeals the most to you to view the details of the 
                        plan. Are no plans looking right for you? Just select the custom training plan option!
                        This option will be a blank plan you can edit to be anything you want!
                        If it seems like it is the plan for you, awesome! The next step will be to
                        edit the plan any way you see fit. While it is nice to have plans to chose from, no 
                        two people are the exact same and neither are there schedules! Just use the edit button
                        on the side of each week to turn the week into a form. Change any days you want
                        and be sure to click save to view your updated plan. Not sure about a specific change? 
                        Don't worry! When it is added to your account your training plan is not set in stone. 
                        After a plan is added to your account you can change it at any time!
                        When you think you have the plan set, just click to add it to your account! 
                    </p>
                    <p>
                        You can have more than one training plan associated with your account. This can
                        be useful if you are someone who likes to plan your runs very far in advance. To
                        view the runs added to your account select the "My Training Plans" tab from the 
                        navigation bar. From here you can click into each of your training plans to view 
                        infomration on them as well as delete plans you don't need anymore. The two key
                        features on this page is the ability to edit a plan and the ability to set an active
                        training plan. By clicking into a training plan you can enter edit mode similar to 
                        when you add a new trainign plan. Setting an active plan is the key to the "Today's Run"
                        widget on the dashboard. The "Today's Run" widget pulls the day's run from the plan
                        you have set as your active plan. To set a plan as your active plan simply enter the plan
                        detail page by clicking on the plan and clicking the "set active plan" button.
                    </p>
                </div>
            </div>
        );
    }
}

export default GeneralHelp;
