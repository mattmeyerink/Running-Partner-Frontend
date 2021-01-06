import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash} from '@fortawesome/free-solid-svg-icons';
import RunPageRunEntry from '../../components/run_page_entry';
import '../../index.css';

class AllRuns extends Component {
    constructor(props) {
        super(props);

        this.state = {
            runs: [],
            totalMiles: 0,
            totalRuns: 0,
            averageMilesPerRun: 0,

            runDeleted: false
        }

        this.getRunData = this.getRunData.bind(this);
        this.deleteRun = this.deleteRun.bind(this);
    }

    // Gather all of the user's runs from the runs db
    componentDidMount() {
        fetch(`http://127.0.0.1:5000/runs/all_runs/${this.props.userData.id}`)
            .then(response => response.json())
            .then(data => {
                var totalMiles = 0;
                var totalRuns = data.length;
                var averageRunMiles = 0;
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
                })
            })
            .catch(error => console.error(error))
    }

    // Deletes a run from the db
    deleteRun(run_id) {
        // Delete the run from the db
        fetch(`http://127.0.0.1:5000/runs/delete_run/${run_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                if (response.status === 200) {
                    this.setState({runDeleted: true})
                }
            })
            .catch(error => console.error(error))
        
    }

    // Re-pull all the user's run data after run deleted or added
    getRunData() {
        fetch(`http://127.0.0.1:5000/runs/all_runs/${this.props.userData.id}`)
            .then(response => response.json())
            .then(data => {
                var totalMiles = 0;
                var totalRuns = data.length;
                var averageRunMiles = 0;
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
                    runDeleted: false
                })
            })
            .catch(error => console.error(error))
    }

    render () {
        if (this.state.runDeleted) {
            this.getRunData();
        }
        return (
            <React.Fragment>
                {this.props.userAuthenticated? 
                <React.Fragment>
                    <div className="row justify-content-center">
                        <h1 className="text_shadow">My Runs</h1>
                    </div>
                    <div className="row justify-content-center text_spacing">
                        <div className="col-md-6">
                            <div className="row justify-content-center">
                                <RunPageRunEntry user_id={this.props.userData.id} city={this.props.userData.city} 
                                        state={this.props.userData.state} getRunData={this.getRunData}/>
                            </div>
                        </div>
                    </div>
                    {this.state.totalRuns === 0?
                    <React.Fragment>
                        <div className="row justify-content-center">
                            <h3>You haven't done any runs yet!</h3>
                        </div>
                        <div className="row justify-content-center">
                            <h3>Theres a whole world to explore! Get out there!</h3>
                        </div>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <div className="row justify-content-center training_run_spacing">
                            <div className="col-md-8 background_color border border-dark">
                                <div className="row justify-content-center">
                                    <strong className="text_spacing">Total Miles: {this.state.totalMiles} Miles</strong>
                                    <strong className="text_spacing">Total Runs: {this.state.totalRuns}</strong>
                                    <strong className="text_spacing">Average Miles Per Run: {(this.state.averageMilesPerRun).toFixed(2)} Miles</strong>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            {this.state.runs.map(run => (
                                <React.Fragment key={run.id}>
                                        <div className="col-md-8 border border-dark run_card">
                                            <div className="row">
                                                <div className="col-md-11">
                                                    <h5>{run.distance} Miles - {run.run_city}, {run.run_state}</h5>
                                                </div>
                                                <div className="col-md-1">
                                                    <button className="icon_button" onClick={() => this.deleteRun(run.id)}>
                                                        <FontAwesomeIcon icon={faTrash} color="red"/>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-10">
                                                    <strong>{run.date.split("-")[1] + " - " + run.date.split("-")[2] + " - " + run.date.split("-")[0]}</strong>
                                                    <p>{run.notes}</p>
                                                </div>
                                            </div>
                                        </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </React.Fragment>
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

export default AllRuns;
