import React, { Component } from "react";
import moment from "moment";
import { Redirect } from "react-router-dom";
import WeatherWidget from "../components/weatherWidget";
import TodaysRun from "../components/todays_run";
import RunEntry from "../components/run_entry";
import Config from "../config";
import "../index.css";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weatherData: {},
      loading: true,
      greeting: null,
      motivationalQuoteText: null,
      motivationalQuoteAuthor: null,
      shouldRedirect: false,
      redirectTo: '',
    };
  }

  componentDidMount() {
    // Set the users page to blank to unhighlight any nav bar tabs
    this.props.setCurrentPage('');

    // Reset path if a page is present in local storage
    const page = localStorage.getItem('currentPath');
    if (page) {
      this.setState({ shouldRedirect: true, redirectTo: page });
    } else {
      // Set current path in local storage
      localStorage.setItem('currentPath', '');
    }

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

    // Note that the api changed so until I get another one I am commenting the fetch out
    // Fetch motivational quote
    // fetch("https://type.fit/api/quotes")
    //     .then(response => response.json())
    //     .then(data => {
    //         const randomNum = Math.floor(Math.random() * data.length);
    //         this.setState({
    //             motivationalQuoteText: data[randomNum].text,
    //             motivationalQuoteAuthor: data[randomNum].author
    //         })
    //     })
    //     .catch(error => console.error(error))

    // Set the greeting message
    this.getGreetingMessage();
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

    return (
      <React.Fragment>
        {this.state.shouldRedirect ? (
          <Redirect to={this.state.redirectTo} />
        ) : (
          <div className="home_page">
            {this.props.userAuthenticated ? (
              <React.Fragment>
                <div className="row justify-content-center home_widgets">
                  <h1 className="white_text">
                    {this.state.greeting} {first_name}!
                  </h1>
                </div>

                {this.state.loading ? (
                  <div className="row justify-content-center">
                    <h1 className="white_text">Loading...</h1>
                  </div>
                ) : (
                  <React.Fragment>
                    {/*
                                  Note Temporarily pulling motivaitonal quote seciton
                                  <div className="row justify-content-center">
                                      <div className="col-md-8">
                                          <div className="row justify-content-center home_widgets">
                                              <div className="col">
                                                  <div className="row justify-content-center">
                                                      <h3 className="quote">{this.state.motivationalQuoteText}</h3>
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="row justify-content-center">
                                              {this.state.motivationalQuoteAuthor === null?
                                              <h3 className="quote">~ unknown</h3>
                                              :
                                              <h3 className="quote">~{this.state.motivationalQuoteAuthor}</h3>
                                              }
                                          </div>
                                      </div>
                                  </div>
                                  */}

                    <div className="row justify-content-center home_widgets">
                      <div className="col-md-3 widget_spacing">
                        <WeatherWidget
                          city={city}
                          state={state}
                          weatherData={this.state.weatherData}
                        />
                      </div>
                      <div className="col-md-4 widget_spacing">
                        <TodaysRun userData={this.props.userData} />
                      </div>
                      <div className="col-md-3 widget_spacing">
                        <RunEntry
                          user_id={id}
                          city={city}
                          state={state}
                          userData={this.props.userData}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Redirect to="/login" />
              </React.Fragment>
            )}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Home;
