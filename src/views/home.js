import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import WeatherWidget from '../components/weatherWidget';

// view for the homepage
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            weatherData: {},
            pageLoaded: false
        }
    }
    
    componentDidMount() {
        const apiKey = process.env.REACT_APP_OW_API_KEY;
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.props.userData.city}&units=imperial&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => this.setState({weatherData: data}))
            .catch(error => console.error(error))

        this.setState({pageLoaded: true})
    }

    render() {
        const {city, state, first_name} = this.props.userData;
        console.log(this.state.weatherData)

        return (
            <React.Fragment>
                {this.props.userAuthenticated ?
                <React.Fragment>
                    <div className="row justify-content-center">
                        <h3>Hello {first_name}</h3>
                    </div>
                    <div className="row justify-content-center">
                        
                        
                    </div>
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
