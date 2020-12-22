import React from 'react';

function WeatherWidget(props) {
    const {city, state, weatherData} = props;
    var description = weatherData.weather[0].description;
    for (var i = 0; i < description.length; i++) {
        description[i] = description[i].charAt(0).toUpperCase() + description[i].slice(1);
    }
    description = description.join(' ');

    return (
        <React.Fragment>
            <div class="row justify-content-center">
                <div class="col-md-4">
                    <div class="row justify-content-center">
                        <h1 id="cityName">{city}, {state}</h1>
                    </div>
                    <div class="row justify-content-center">
                        <div id="icon">
                            <img id="iconImage" src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`} alt="Oops" class="img-fluid" />
                        </div>
                        <div class="row justify-content-center">
                            <p id="description">{description}</p>
                        </div>
                        <div class="row justify-content-center">
                            <p id="currentTemp">Current Temperature: {weatherData.main.temp}</p>
                        </div>
                        <div class="row justify-content-center">
                            <p id="max">Today's High: {weatherData.main.temp_max}</p>
                        </div>
                        <div class="row justify-content-center">
                            <p id="min">Today's Low: {weatherData.main.temp_min}</p>
                        </div>
                        <div class="row justify-content-center">
                            <p id="feelsLike">Feels Like: {weatherData.main.feels_like}</p>
                        </div>
                        <div class="row justify-content-center">
                            <p id="humidity">Humidity: {weatherData.main.humidity}</p>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default WeatherWidget;
