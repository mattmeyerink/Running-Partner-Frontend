import React, { Component } from "react";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import CardDeck from "react-bootstrap/CardDeck";
import Card from "react-bootstrap/Card";
import moment from "moment";
import { Redirect } from "react-router-dom";
import WeatherWidget from "../components/WeatherWidget";
import TodaysRun from "../components/TodaysRun";
import RunEntry from "../components/RunEntry";
import { RunningQuotes } from "../RunningQuotes";
import Config from "../config";
import "../index.css";

interface HomeProps {
  setCurrentPage(page: string): void;
  userAuthenticated: boolean;
  userData: any;
}

interface HomeState {
  weatherData: any;
  loading: boolean;
  greeting: any;
  shouldRedirect: boolean;
}

/**
 * Class to handle and render the main dashboard
 */
class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);

    this.state = {
      weatherData: {},
      loading: true,
      greeting: null,
      shouldRedirect: false,
    };

    this.getQuote = this.getQuote.bind(this);
  }

  componentDidMount() {
    // Set the users page to blank to unhighlight any nav bar tabs
    this.props.setCurrentPage("");

    // Set the current path to home
    localStorage.setItem("currentPath", "/");

    // Ensure user authenticated before loading data for weather, quote and runs
    if (this.props.userAuthenticated) {
      const myHeaders = new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.props.userData.token,
      });

      // Fetch the weather data
      fetch(Config.rpAPI + `/weather/${this.props.userData.city}`, {
        method: "GET",
        headers: myHeaders,
      })
        .then((response) => response.json())
        .then((data) => this.setState({ weatherData: data, loading: false }))
        .catch((error) => console.error(error));
    }

    // Set the greeting message
    this.getGreetingMessage();
  }

  /**
   * Gets a random quote from the running quotes array
   */
  getQuote() {
    const randomIndex = Math.floor(RunningQuotes.length * Math.random());
    return RunningQuotes[randomIndex];
  }

  // Determine the greeting message based on the time
  getGreetingMessage() {
    if (moment().hour() < 12) {
      this.setState({ greeting: "Good Morning " });
    } else if (moment().hour() < 17) {
      this.setState({ greeting: "Good Afternoon " });
    } else {
      this.setState({ greeting: "Good Night " });
    }
  }

  render() {
    const { city, state, first_name, id } = this.props.userData;
    const quote = this.getQuote();

    return (
      <Container className="home_page">
        {this.props.userAuthenticated ? (
          <React.Fragment>
            {this.state.loading ? (
              <Row className="justify-content-center home_widgets">
                <h1 className="white_text">
                  Loading <Spinner animation="border" variant="light" />
                </h1>
              </Row>
            ) : (
              <React.Fragment>
                <Card className="homescreen_quote">
                  <Card.Title className="text-center filter_dropdown">
                    <h2>
                      {this.state.greeting} {first_name}!
                    </h2>
                  </Card.Title>
                  <Card.Body>
                    <blockquote className="blockquote mb-0">
                      <p>
                        {quote.quote}
                      </p>
                      <footer className="blockquote-footer">
                        {quote.author}
                      </footer>
                    </blockquote>
                  </Card.Body>
                </Card>
                <CardDeck>
                  <WeatherWidget
                    city={city}
                    state={state}
                    weatherData={this.state.weatherData}
                  />
                  <TodaysRun userData={this.props.userData} />
                  <RunEntry
                    user_id={id}
                    city={city}
                    state={state}
                    userData={this.props.userData}
                  />
                </CardDeck>
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Redirect to="/login" />
          </React.Fragment>
        )}
      </Container>
    );
  }
}

export default Home;
