import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import WeatherWidget from '../components/weatherWidget';
import TodaysRun from '../components/todays_run';
import RunEntry from '../components/run_entry';

// view for the homepage
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            weatherData: {},
            loading: true
        }
    }
    
    // Make initial API Calls for weather data, today's run, and run input.
    componentDidMount() {
        if (this.props.userAuthenticated) {
            const apiKey = process.env.REACT_APP_OW_API_KEY;
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.props.userData.city}&units=imperial&appid=${apiKey}`)
                .then(response => response.json())
                .then(data => this.setState({weatherData: data, loading: false}))
                .catch(error => console.error(error))
            }
    }

    render() {
        const {city, state, first_name} = this.props.userData;

        return (
            <React.Fragment>
                {this.props.userAuthenticated ?
                <React.Fragment>
                    <div className="row justify-content-center">
                        <h1>Hello {first_name}</h1>
                    </div>

                    {this.state.loading ?
                    <div className="row justify-content-center">
                        <h1>Loading...</h1>
                    </div>
                    :
                    <div className="row justify-content-center">
                        <div className="col-md-3">
                            <WeatherWidget city={city} state={state} weatherData={this.state.weatherData} />
                        </div>
                        <div className="col-md-3 widget_spacing">
                            <TodaysRun />
                        </div>
                        <div className="col-md-3 widget_spacing">
                            <RunEntry />
                        </div>
                    </div>
                    }
                </React.Fragment> 
                :
                <React.Fragment>
                    <Redirect to="/login" />
                </React.Fragment>
                }
            </React.Fragment>
        )
    }
}

export default Home
