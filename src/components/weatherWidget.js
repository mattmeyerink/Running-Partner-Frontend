import React from 'react';
import './components.css';

function WeatherWidget(props) {
    const {city, state, weatherData} = props;
    var description = weatherData.weather[0].description.split(" ");

    for (var i = 0; i < description.length; i++) {
        description[i] = description[i].charAt(0).toUpperCase() + description[i].slice(1);
    }
    description = description.join(" ");

    return (
        <React.Fragment>
            <div className="row justify-content-center">
                <div className="border border-dark weather_card">
                    <div className="row justify-content-center">
                        <h3 id="cityName">{city}, {state}</h3>
                    </div>
                    <div className="row justify-content-center">
                        <img id="iconImage" src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="Oops" className="img-fluid" />
                    </div>
                    <div className="row justify-content-center">
                        <p>{description}</p>
                    </div>
                    <div className="row justify-content-center">
                        <p id="currentTemp">Current Temperature: {weatherData.main.temp} F</p>
                    </div>
                    <div className="row justify-content-center">
                        <p id="max">Today's High: {weatherData.main.temp_max} F</p>
                    </div>
                    <div className="row justify-content-center">
                        <p id="min">Today's Low: {weatherData.main.temp_min} F</p>
                    </div>
                    <div className="row justify-content-center">
                        <p id="feelsLike">Feels Like: {weatherData.main.feels_like} F</p>
                    </div>
                    <div className="row justify-content-center">
                        <p id="humidity">Humidity: {weatherData.main.humidity} %</p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default WeatherWidget;
