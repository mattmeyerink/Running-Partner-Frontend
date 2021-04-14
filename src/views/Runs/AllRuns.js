import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import RunPageRunEntry from "../../components/RunPageEntry";
import Config from "../../config";
import "../../index.css";

/*
 * Page to display and handle the user's runs
 */
class AllRuns extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      runs: [],
      totalMiles: 0,
      totalRuns: 0,
      averageMilesPerRun: 0,

      runDeleted: false,
    };

    this.getRunData = this.getRunData.bind(this);
    this.deleteRun = this.deleteRun.bind(this);
  }

  componentDidMount() {
    // Set the current page to myRuns for the nav bar
    this.props.setCurrentPage("myRuns");

    // Set current path in local storage
    localStorage.setItem("currentPath", "/all_runs");

    // Prepare the headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Gather the users runs and process the data
    fetch(Config.rpAPI + `/runs/all_runs/${this.props.userData.id}`, {
      method: "GET",
      headers: myHeaders,
    })
      .then((response) => response.json())
      .then((data) => {
        let totalMiles = 0;
        const totalRuns = data.length;
        let averageRunMiles = 0;
        for (let i = 0; i < data.length; i++) {
          totalMiles += data[i].distance;
        }
        if (totalRuns !== 0) {
          averageRunMiles = totalMiles / totalRuns;
        }
        this.setState({
          runs: data,
          totalMiles: totalMiles,
          totalRuns: totalRuns,
          averageMilesPerRun: averageRunMiles,
          loading: false,
        });
      })
      .catch((error) => console.error(error));
  }

  /*
   * Deletes a run from the db
   */
  deleteRun(run_id) {
    // Prepare headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Delete the run from the db
    fetch(Config.rpAPI + `/runs/delete_run/${run_id}`, {
      method: "DELETE",
      headers: myHeaders,
    })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ runDeleted: true });
        }
      })
      .catch((error) => console.error(error));
  }

  /*
   * Re-pull all the user's run data after run deleted or added
   */
  getRunData() {
    // Prepare headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Gather all the runs from the db and handle the data
    fetch(Config.rpAPI + `/runs/all_runs/${this.props.userData.id}`, {
      method: "GET",
      headers: myHeaders,
    })
      .then((response) => response.json())
      .then((data) => {
        let totalMiles = 0;
        const totalRuns = data.length;
        let averageRunMiles = 0;
        for (let i = 0; i < data.length; i++) {
          totalMiles += data[i].distance;
        }
        if (totalRuns !== 0) {
          averageRunMiles = totalMiles / totalRuns;
        }
        this.setState({
          runs: data,
          totalMiles: totalMiles,
          totalRuns: totalRuns,
          averageMilesPerRun: averageRunMiles,
          runDeleted: false,
        });
      })
      .catch((error) => console.error(error));
  }

  render() {
    if (this.state.runDeleted) {
      this.getRunData();
    }
    return (
      <React.Fragment>
        {this.props.userAuthenticated ? (
          <React.Fragment>
            <div className="row justify-content-center">
              <h1 className="white_text">My Runs</h1>
            </div>
            <div className="row justify-content-center text_spacing">
              <div className="col-md-5 run_entry_input_box">
                <div className="row justify-content-center">
                  <RunPageRunEntry
                    user_id={this.props.userData.id}
                    city={this.props.userData.city}
                    state={this.props.userData.state}
                    getRunData={this.getRunData}
                    userData={this.props.userData}
                  />
                </div>
              </div>
            </div>
            {this.state.loading ? (
              <div className="row justify-content-center">
                <h1 className="white_text">
                  Loading <Spinner animation="border" variant="light" />
                </h1>
              </div>
            ) : (
              <React.Fragment>
                {this.state.totalRuns === 0 ? (
                  <React.Fragment>
                    <div className="row justify-content-center">
                      <h3 className="white_text">
                        You haven't done any runs yet!
                      </h3>
                    </div>
                    <div className="row justify-content-center">
                      <h3 className="white_text">
                        Theres a whole world to explore! Get out there!
                      </h3>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className="row justify-content-center training_run_spacing">
                      <div className="col-md-7 background_color">
                        <div className="row justify-content-center">
                          <strong className="text_spacing">
                            Total Miles: {this.state.totalMiles} Miles
                          </strong>
                          <strong className="text_spacing">
                            Total Runs: {this.state.totalRuns}
                          </strong>
                          <strong className="text_spacing">
                            Average Miles Per Run:{" "}
                            {this.state.averageMilesPerRun.toFixed(2)} Miles
                          </strong>
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      {this.state.runs.map((run) => (
                        <React.Fragment key={run.id}>
                          <div className="col-md-8 run_card">
                            <div className="row">
                              <div className="col-md-11">
                                <h5>
                                  {run.distance} Miles - {run.run_city},{" "}
                                  {run.run_state}
                                </h5>
                              </div>
                              <div className="col-md-1">
                                <button
                                  className="icon_button"
                                  onClick={() => this.deleteRun(run.id)}
                                >
                                  <FontAwesomeIcon icon={faTrash} color="red" />
                                </button>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-10">
                                <strong>
                                  {run.date.split("-")[1] +
                                    " - " +
                                    run.date.split("-")[2] +
                                    " - " +
                                    run.date.split("-")[0]}
                                </strong>
                                <p>{run.notes}</p>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Redirect to="/login" />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default AllRuns;
