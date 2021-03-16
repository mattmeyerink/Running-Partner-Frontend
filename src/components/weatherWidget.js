import React from "react";
import "./components.css";

function WeatherWidget(props) {
  const { city, state, weatherData } = props;
  var description = weatherData.weather[0].description.split(" ");

  for (var i = 0; i < description.length; i++) {
    description[i] =
      description[i].charAt(0).toUpperCase() + description[i].slice(1);
  }
  description = description.join(" ");

  return (
    <React.Fragment>
      <div className="row justify-content-center">
        <div className="weather_card">
          <div className="row justify-content-center">
            <h3 id="cityName">
              {city}, {state}
            </h3>
          </div>
          <div className="row justify-content-center">
            <img
              id="iconImage"
              src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
              alt="Oops"
              className="img-fluid"
            />
          </div>
          <div className="row justify-content-center">
            <strong>{description}</strong>
          </div>
          <div className="row justify-content-center">
            <p id="currentTemp">
              <b>Current Temperature:</b> {parseInt(weatherData.main.temp)} F
            </p>
          </div>
          <div className="row justify-content-center">
            <p id="max">
              <b>Today's High:</b> {parseInt(weatherData.main.temp_max)} F
            </p>
          </div>
          <div className="row justify-content-center">
            <p id="min">
              <b>Today's Low:</b> {parseInt(weatherData.main.temp_min)} F
            </p>
          </div>
          <div className="row justify-content-center">
            <p id="feelsLike">
              <b>Feels Like:</b> {parseInt(weatherData.main.feels_like)} F
            </p>
          </div>
          <div className="row justify-content-center">
            <p id="humidity">
              <b>Humidity:</b> {parseInt(weatherData.main.humidity)} %
            </p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default WeatherWidget;
