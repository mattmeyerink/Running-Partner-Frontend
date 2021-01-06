import React, {Component} from 'react';
import moment from 'moment';
import StatesForm from './statesForm';
import '../index.css';

class RunEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            distance: "",
            date: moment().format("YYYY-MM-DD"),
            city: this.props.city,
            state: this.props.state,
            notes: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // Update state with changes from run form
    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }

    // Submit run data to db
    handleSubmit(event) {
        // Create json object to send in POST request
        const runData = {
            user_id: this.props.user_id,
            distance: this.state.distance,
            date: this.state.date,
            run_city: this.state.city,
            run_state: this.state.state,
            notes: this.state.notes
        }

        // Send POST request to create run in the db
        fetch('http://127.0.0.1:5000/runs/add_run', {
            method: "POST",
            body: JSON.stringify(runData),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => {
            // Reset the form fields if request was successful
            if (response.status === 201) {
                this.setState({
                    distance: "",
                    date: moment().format("YYYY-MM-DD"),
                    city: this.props.city,
                    state: this.props.state,
                    notes: ""
                })
            }
        })
        .catch(error => console.error(error))

        event.preventDefault();
    }

    render() {
        return (
            <React.Fragment>
                <div className="row justify-content-center">
                    <div className="border border-dark weather_card">
                        <h3>Enter a Run</h3>
                        <form onSubmit={this.handleSubmit}>
                            <input type="number" name="distance" value={this.state.distance} onChange={this.handleChange} placeholder="Distance" className="form_spacing form-control" />
                            <input type="date" name="date" value={this.state.date} onChange={this.handleChange} placeholder="Date (MM/DD/YYYY)" className="form_spacing form-control" />
                            <input type="text" name="city" value={this.state.city} onChange={this.handleChange} placeholder="City" className="form_spacing form-control" />
                            <select name="state" value={this.state.state} onChange={this.handleChange} className="form_spacing form-control">
                                <StatesForm />
                            </select>
                            <textarea name="notes" value={this.state.notes} onChange={this.handleChange} placeholder="Notes" className="form_spacing form-control" />
                            <input type="submit" className="form-control btn btn-success form_spacing"/>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default RunEntry;