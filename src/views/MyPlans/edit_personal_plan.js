import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import '../../index.css'

class EditPlan extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            planData: {},
            finalPlan: "",
            inEditMode: {
                status: false,
                rowKey: null,
                rowValues: null
            },

            startDateEdit: null,
            mondayEdit: null,
            tuesdayEdit: null,
            wednesdayEdit: null,
            thursdayEdit: null,
            fridayEdit: null,
            saturdayEdit: null,
            sundayEdit: null,
            totalEdit: null,

            planSubmitted: false
        }

        this.convertToTable = this.convertToTable.bind(this);
        this.editTable = this.editTable.bind(this);
        this.saveTable = this.saveTable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitPlan = this.submitPlan.bind(this);
    }

    // Gather the individual training plan from custom plan table
    componentDidMount(){
        fetch(`http://127.0.0.1:5000/training_plans/custom_plan/${this.props.match.params.id}`)
            .then(result => result.json())
            .then(data => this.setState({planData: data, loading: false, finalPlan: data.plan}))
            .catch(error => console.error(error))
    }

    // Converts the plan in state to an array that can be mapped to a table when rendered
    convertToTable() {
        // Pull the plan data from state
        const plan = this.state.finalPlan;

        // Split the plan into a string for each week
        var weeks = plan.split("-");
        
        // Create a matrix of runs for each week
        var planOutput = []
        for (var i = 0; i < weeks.length; i++) {
            // Split the week into each days run
            var days = weeks[i].split(",");

            // Push each days run to the array and update weeks total mileage
            var weekOutput = [];
            var total = 0;
            for (var j = 0; j < days.length; j++) {
                weekOutput.push(days[j]);
                if (j !== 0) {
                    total += parseFloat(days[j]);
                }
                
            }

            // Add the total to the week's array and add week to the matrix
            weekOutput.push(total);
            planOutput.push(weekOutput);
        }

        return planOutput;
    }

    // Set state that the training table is in edit mode
    editTable(rowKey, week) {
        this.setState({inEditMode: {
            status: true,
            rowKey: rowKey
        },
        
        startDateEdit: week[0],
        mondayEdit: week[1],
        tuesdayEdit: week[2],
        wednesdayEdit: week[3],
        thursdayEdit: week[4],
        fridayEdit: week[5],
        saturdayEdit: week[6],
        sundayEdit: week[7],
        totalEdit: week[8]
    })
    }

    // Save the results of table edit to state
    saveTable(index, planData) {
        // Push the new row values for each day to the matrix
        planData[index] = [this.state.startDateEdit, this.state.mondayEdit, this.state.tuesdayEdit, this.state.wednesdayEdit, 
                            this.state.thursdayEdit, this.state.fridayEdit, this.state.saturdayEdit, 
                            this.state.sundayEdit, this.state.totalEdit];

        // Create trianing data string to push to matrix
        var outputPlan = "";
        for (var i = 0; i < planData.length; i++) {
            for (var j = 0; j < planData[0].length - 1; j++) {
                // Add a comma between runs during the week
                if (j !== planData[0].length - 2) {
                    outputPlan += planData[i][j] + ",";
                }
                // Add a dash between the data for each week
                else {
                    outputPlan += planData[i][j] + "-";
                }
            }
        }
    
        // Remove the trailing dash from the plan string
        outputPlan = outputPlan.slice(0, -1);
        
        // Clear the state edit mode variables and push new plan string
        this.setState({inEditMode: {
            status: false,
            rowKey: null,
            mondayEdit: null,
            tuesdayEdit: null,
            wednesdayEdit: null,
            thursdayEdit: null,
            fridayEdit: null,
            saturdayEdit: null,
            sundayEdit: null,
            totalEdit: null
        },
        finalPlan: outputPlan
    })
    }

    // Handle a change to the training plan
    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }

    // Submit the edited plan to the database
    submitPlan() {
        // Create a JSON object to send edited plan to db in post request
        const planData = {
            plan: this.state.finalPlan
        }

        // Send POST request to db with edited plan update the plan submitted in state to force redirect
        fetch(`http://127.0.0.1:5000/training_plans/custom_plan/edit/${this.state.planData.id}`, {
            method: "POST",
            body: JSON.stringify(planData),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => {
            if (response.status === 200) {
                this.setState({planSubmitted: true})
            }
        })
        .catch(error => console.error(error))
    }

    render() {
        var planData = []
        if (!this.state.loading) {
            planData = this.convertToTable();
        }

        return (
            <React.Fragment>
                {this.props.userAuthenticated ?
                <React.Fragment>
                    {this.state.loading ?
                    <React.Fragment>
                        <div className="row justify-content-center">
                            <h1>Loading...</h1>
                        </div>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        {this.state.planSubmitted?
                        <React.Fragment>
                            <Redirect to="/personal_plan" />
                        </React.Fragment>
                        :
                        <React.Fragment>
                        <div className="row justify-content-center">
                            <h1>{this.state.planData.race_name} - {this.state.planData.difficulty}</h1>
                        </div>
                        <div className="row justify-content-center">
                            <button onClick={this.submitPlan} className="btn btn-success form_spacing">Submit Plan</button>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-10">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <th>Week</th>
                                            <th>Monday</th>
                                            <th>Tuesday</th>
                                            <th>Wednesday</th>
                                            <th>Thursday</th>
                                            <th>Friday</th>
                                            <th>Saturday</th>
                                            <th>Sunday</th>
                                            <th>Total</th>
                                        </tr>
                                        {planData.map((week, index) => (
                                            <React.Fragment key={index}>
                                                <tr>
                                                    <td><b>{week[0]}</b></td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <input className="training_col" type="number" name="mondayEdit" value={this.state.mondayEdit} onChange={this.handleChange}></input>:
                                                        <React.Fragment>
                                                            {week[1]}
                                                        </React.Fragment>
                                                        }
                                                    </td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <input className="training_col" type="number" name="tuesdayEdit" value={this.state.tuesdayEdit} onChange={this.handleChange}></input>:
                                                        <React.Fragment>
                                                            {week[2]}
                                                        </React.Fragment>
                                                        }
                                                    </td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <input className="training_col" type="number" name="wednesdayEdit" value={this.state.wednesdayEdit} onChange={this.handleChange}></input>:
                                                        <React.Fragment>
                                                            {week[3]}
                                                        </React.Fragment>
                                                        }
                                                    </td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <input className="training_col" type="number" name="thursdayEdit" value={this.state.thursdayEdit} onChange={this.handleChange}></input>:
                                                        <React.Fragment>
                                                            {week[4]}
                                                        </React.Fragment>
                                                        }
                                                    </td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <input className="training_col" type="number" name="fridayEdit" value={this.state.fridayEdit} onChange={this.handleChange}></input>:
                                                        <React.Fragment>
                                                            {week[5]}
                                                        </React.Fragment>
                                                        }
                                                    </td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <input className="training_col" type="number" name="saturdayEdit" value={this.state.saturdayEdit} onChange={this.handleChange}></input>:
                                                        <React.Fragment>
                                                            {week[6]}
                                                        </React.Fragment>
                                                        }
                                                    </td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <input className="training_col" type="number" name="sundayEdit" value={this.state.sundayEdit} onChange={this.handleChange}></input>
                                                        :
                                                        <React.Fragment>
                                                            {week[7]}
                                                        </React.Fragment>
                                                        }
                                                    </td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <React.Fragment>
                                                            {(this.state.totalEdit).toFixed(1)}
                                                        </React.Fragment>:
                                                        <React.Fragment>
                                                            {(week[8]).toFixed(1)}
                                                        </React.Fragment>
                                                        }
                                                    </td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <React.Fragment>
                                                            <button className="btn btn-success" onClick={() => this.saveTable(index, planData)}>Save</button>
                                                        </React.Fragment>:
                                                        <React.Fragment>
                                                            <button className="btn btn-warning" onClick={() => this.editTable(index, week)}>Edit</button>
                                                        </React.Fragment>
                                                        }
                                                    </td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                    </React.Fragment>
                        }
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

export default EditPlan;
