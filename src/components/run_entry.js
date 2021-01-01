import React, {Component} from 'react';
import '../index.css';

class RunEntry extends Component {
    constructor() {
        super();

        this.state = {
            distance: undefined,
            date: undefined,
            notes: undefined
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


        event.preventDefault();
    }

    render() {
        return (
            <React.Fragment>
                <div className="row justify-content-center">
                    <div className="border border-dark weather_card">
                        <h4>Enter a Run</h4>
                        <form onSubmit={this.handleSubmit}>
                            <input type="number" name="distance" value={this.state.distance} onChange={this.handleChange} placeholder="Distance" className="form_spacing form-control" />
                            <input type="text" name="date" value={this.state.date} onChange={this.handleChange} placeholder="Date (MM/DD/YYYY)" className="form_spacing form-control" />
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