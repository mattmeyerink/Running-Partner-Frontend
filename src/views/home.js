import React, {Component} from 'react';
import moment from 'moment';
import {Redirect} from 'react-router-dom';
import WeatherWidget from '../components/weatherWidget';
import TodaysRun from '../components/todays_run';
import RunEntry from '../components/run_entry';
import '../index.css';

// view for the homepage
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            weatherData: {},
            loading: true,
            greeting: null,
            motivationalQuoteText: null,
            motivationalQuoteAuthor: null
        }
    }
    
    // Make initial API Calls for weather data, today's run, and run input.
    componentDidMount() {
        if (this.props.userAuthenticated) {

            // Fetch the weather data (hind sight I should move this to the weatherWidget component)
            const apiKey = process.env.REACT_APP_OW_API_KEY;
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.props.userData.city}&units=imperial&appid=${apiKey}`)
                .then(response => response.json())
                .then(data => this.setState({weatherData: data, loading: false}))
                .catch(error => console.error(error))
            }

            // Fetch motivational quote
            fetch("https://type.fit/api/quotes")
                .then(response => response.json())
                .then(data => {
                    const randomNum = Math.floor(Math.random() * data.length);
                    this.setState({
                        motivationalQuoteText: data[randomNum].text,
                        motivationalQuoteAuthor: data[randomNum].author
                    })
                })
                .catch(error => console.error(error))


            // Set the greeting message
            this.getGreetingMessage();
    }

    // Determine the greeting message based on the time
    getGreetingMessage() {
        if (moment().hour() < 12) {
            this.setState({greeting: "Good Morning "});
        }
        else if (moment().hour() < 17) {
            this.setState({greeting: "Good Afternoon "});
        }
        else {
            this.setState({greeting: "Good Night "})
        }
    }

    render() {
        const {city, state, first_name, id} = this.props.userData;

        return (
            <div className="home_page">
                {this.props.userAuthenticated ?
                <React.Fragment>
                    <div className="row justify-content-center home_widgets">
                        <h1 className="text_shadow">{this.state.greeting} {first_name}!</h1>
                    </div>
                    

                    {this.state.loading ?
                    <div className="row justify-content-center">
                        <h1 className="text_shadow">Loading...</h1>
                    </div>
                    :
                    <React.Fragment>
                        <div className="row justify-content-center">
                            <div className="col-md-8 background_color border border-dark">
                                <div className="row justify-content-center home_widgets">
                                    <div className="col-md-8">
                                        <div className="row justify-content-center">
                                        <h4 className="text_shadow">{this.state.motivationalQuoteText}</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <h4 className="text_shadow">~{this.state.motivationalQuoteAuthor}</h4>
                                </div>
                            </div>
                        </div>
                        
                        <div className="row justify-content-center home_widgets">
                            <div className="col-md-3">
                                <WeatherWidget city={city} state={state} weatherData={this.state.weatherData} />
                            </div>
                            <div className="col-md-3 widget_spacing">
                                <TodaysRun userData={this.props.userData}/>
                            </div>
                            <div className="col-md-3 widget_spacing">
                                <RunEntry user_id={id} city={city} state={state}/>
                            </div>
                        </div>
                    </React.Fragment>
                    }
                </React.Fragment> 
                :
                <React.Fragment>
                    <Redirect to="/login" />
                </React.Fragment>
                }
            </div>
        )
    }
}

export default Home
