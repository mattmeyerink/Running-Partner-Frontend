import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import CardDeck from "react-bootstrap/CardDeck";
import RunEntry from "../../components/RunEntry";
import RunStatisticsModal from "../../components/RunStatsModal";
import RunCardCollection from "../../components/RunCardCollection";   
import Config from "../../config";
import "../../index.css";

interface AllRunsProps {
  setCurrentPage(page: string): void;
  userData: any;
  userAuthenticated: boolean;
}

interface AllRunsState {
  loading: boolean;
  runs: any;
  totalMiles: number;
  totalRuns: number;
  averageMilesPerRun: number;
  runDeleted: boolean;
}

/**
 * Page to display and handle the user's runs
 */
class AllRuns extends Component<AllRunsProps, AllRunsState> {
  constructor(props: AllRunsProps) {
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

  /**
   * Deletes a run from the db
   */
  deleteRun(run_id: number) {
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

  /**
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
          <Container fluid>
            <h1 className="white_text text-center">My Runs</h1>
            {this.state.loading ? (
              <h1 className="white_text text-center">
                Loading <Spinner animation="border" variant="light" />
              </h1>
            ) : (
              <React.Fragment>
                <CardDeck className="text_spacing text-center">
                  <RunStatisticsModal runs={this.state.runs}/>
                  <RunEntry
                    user_id={this.props.userData.id}
                    city={this.props.userData.city}
                    state={this.props.userData.state}
                    getRunData={this.getRunData}
                    userData={this.props.userData}
                    isRunPage={true}
                  />
                </CardDeck>
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
                    <RunCardCollection runs={this.state.runs} deleteRun={this.deleteRun} userData={this.props.userData} getRunData={this.getRunData} />
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </Container>
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
