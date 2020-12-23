import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import WeatherWidget from '../components/weatherWidget';

// view for the homepage
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            weatherData: {},
            loading: true
        }
    }
    
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
                        <h3>Hello {first_name}</h3>
                    </div>

                    {this.state.loading ?
                    <p>Loading...</p> :
                    <div className="row justify-content-center">
                        <WeatherWidget city={city} state={state} weatherData={this.state.weatherData} />
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
