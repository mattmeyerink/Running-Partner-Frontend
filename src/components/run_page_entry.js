import React, {Component} from 'react';
import moment from 'moment';
import StatesForm from './statesForm';
import '../index.css';

class RunPageRunEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            distance: "",
            date: moment().format("L"),
            city: this.props.city,
            state: this.props.state,
            notes: ""
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }

    render() {
        return (
            <React.Fragment>
                <form>
                    <div className="row form_spacing">
                        <div className="col-md-6">  
                            <input type="number" name="distance" value={this.state.distance} onChange={this.handleChange} placeholder="Distance" className="form-control"/>
                        </div>
                        <div className="col-md-6">
                            <input type="date" name="date" value={this.state.date} onChange={this.handleChange} placeholder="Date (MM/DD/YYYY)" className="form-control"/>
                        </div>
                    </div>
                    <div className="row form_spacing">
                        <div className="col-md-6">
                            <input type="text" name="city" value={this.state.city} onChange={this.handleChange} placeholder="City" className="form-control" />
                        </div>
                        <div className="col-md-6">
                            <select name="state" value={this.state.state} onChange={this.handleChange} className="form-control">
                                <StatesForm />
                            </select>
                        </div>
                    </div>
                    <textarea name="notes" value={this.state.notes} onChange={this.handleChange} placeholder="Notes" className="form-control form_spacing"/>
                    <input type="submit" className="btn btn-success form-control" />
                </form>
            </React.Fragment>
        )
    }
}

export default RunPageRunEntry;
