import React from "react";
import Card from "react-bootstrap/Card";
import "./components.css";

interface WeatherProps {
  city: string;
  state: string;
  weatherData: any;
}

/**
 * Function to display the weather for the person's current city
 */
function WeatherWidget(props: WeatherProps) {
  const { city, state, weatherData } = props;
  let description = weatherData.weather[0].description.split(" ");

  for (let i = 0; i < description.length; i++) {
    description[i] =
      description[i].charAt(0).toUpperCase() + description[i].slice(1);
  }
  description = description.join(" ");

  return (
    <Card className="text-center">
      <Card.Header>
        <h3>Weather</h3>
      </Card.Header>
      <Card.Body>
        <Card.Title>
          <h4>
            {city}, {state}
          </h4>
        </Card.Title>
        <img
          id="iconImage"
          src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
          alt="Oops"
          className="img-fluid"
        />
        <Card.Text>
          <strong>{description}</strong>
        </Card.Text>
        <Card.Text>
          <b>Current Temperature:</b> {parseInt(weatherData.main.temp)} F
        </Card.Text>
        <Card.Text>
          <b>Today's High:</b> {parseInt(weatherData.main.temp_max)} F
        </Card.Text>
        <Card.Text>
          <b>Today's Low:</b> {parseInt(weatherData.main.temp_min)} F
        </Card.Text>
        <Card.Text>
          <b>Feels Like:</b> {parseInt(weatherData.main.feels_like)} F
        </Card.Text>
        <Card.Text>
          <b>Humidity:</b> {parseInt(weatherData.main.humidity)} %
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default WeatherWidget;
