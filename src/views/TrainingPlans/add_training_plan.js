import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import moment from 'moment';
import '../../index.css'

class AddPlan extends Component {
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

            mondayEdit: null,
            tuesdayEdit: null,
            wednesdayEdit: null,
            thursdayEdit: null,
            fridayEdit: null,
            saturdayEdit: null,
            sundayEdit: null,
            totalEdit: null,

            planSubmitted: false,

            possibleStartDates: [],
            currentPlanDates: [],
            next2YearsDates: [],
            startDate: null
            
        }

        this.findFirstMonday = this.findFirstMonday.bind(this);
        this.convertToTable = this.convertToTable.bind(this);
        this.editTable = this.editTable.bind(this);
        this.saveTable = this.saveTable.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitPlan = this.submitPlan.bind(this);
    }

    // Gather the individual training plan
    componentDidMount(){
        fetch(`http://127.0.0.1:5000/training_plans/${this.props.match.params.id}`)
            .then(result => result.json())
            .then(data => this.setState({planData: data, loading: false, finalPlan: data.plan}))
            .catch(error => console.error(error))

        this.findFirstMonday();
    }

    // Assign the moment object for the next monday in state
    findFirstMonday() {
        let currentDay = moment();
        while (currentDay.format("dddd") !== "Monday") {
            currentDay = currentDay.add(1, "days");
        }

        let startDates = []
        for (var i = 0; i < 104; i++) {
            startDates.push(currentDay.format("L"));
            currentDay = currentDay.add(7, "days");
        }
        this.setState({
            possibleStartDates: startDates.slice(0,53),
            startDate: startDates[0],
            currentPlanDates: startDates,
            next2YearsDates: startDates
        });
    }

    // Converts the plan in state to an array that can be mapped to a table when rendered
    convertToTable() {
        var planOutput = []
        const plan = this.state.finalPlan;
        var weeks = plan.split("-");
        for (var i = 0; i < weeks.length; i++) {
            var days = weeks[i].split(",");
            var weekOutput = [];
            var total = 0;
            for (var j = 0; j < days.length; j++) {
                weekOutput.push(days[j]);
                total += parseInt(days[j]);
            }
            weekOutput.push(total);
            planOutput.push(weekOutput);
        }

        return planOutput;
    }

    editTable(rowKey, week) {
        this.setState({inEditMode: {
            status: true,
            rowKey: rowKey
        },
        mondayEdit: week[0],
        tuesdayEdit: week[1],
        wednesdayEdit: week[2],
        thursdayEdit: week[3],
        fridayEdit: week[4],
        saturdayEdit: week[5],
        sundayEdit: week[6],
        totalEdit: week[7]
    })
    }

    saveTable(index, planData) {
        planData[index] = [this.state.mondayEdit, this.state.tuesdayEdit, this.state.wednesdayEdit, 
                            this.state.thursdayEdit, this.state.fridayEdit, this.state.saturdayEdit, 
                            this.state.sundayEdit, this.state.totalEdit];
        
        var outputPlan = "";
        for (var i = 0; i < planData.length; i++) {
            for (var j = 0; j < planData[0].length - 1; j++) {
                if (j !== planData[0].length - 2) {
                    outputPlan += planData[i][j] + ",";
                }
                else {
                    outputPlan += planData[i][j] + "-";
                }
            }
        }
    
        // Remove the trailing dash from the plan
        outputPlan = outputPlan.slice(0, -1);
        
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

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        if (name === "startDate") { 
            var next2YearsDates = this.state.next2YearsDates;
            var possibleStartDates = this.state.possibleStartDates;
            var dateIndex;
            for (var i = 0; i < possibleStartDates.length; i++) {
                if (value === possibleStartDates[i]) {
                    dateIndex = i;
                }
            }
            this.setState({currentPlanDates: next2YearsDates.slice(dateIndex)})
        }
        this.setState({[name]: value});
    }

    submitPlan() {
        const userID = this.props.userData.id;

        const planData = {
            user_id: this.props.userData.id,
            plan: this.state.finalPlan,
            difficulty: this.state.planData.difficulty,
            race_name: this.state.planData.race_name,
            plan_length: this.state.planData.plan_length,
        }

        fetch(`http://127.0.0.1:5000/training_plans/add_plan/${userID}`, {
            method: "POST",
            body: JSON.stringify(planData),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(response => {
            if (response.status === 201) {
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
                            <Redirect to="/profile" />
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
                            <h4 className="label_margin">Start Date</h4>
                            <form>
                                <select name="startDate" value={this.state.startDate} onChange={this.handleChange}>
                                    {this.state.possibleStartDates.map((possibleStartDate, index) => (
                                        <React.Fragment key={index}>
                                            <option value={possibleStartDate}>{possibleStartDate}</option>
                                        </React.Fragment>
                                    ))}
                                </select>
                            </form>
                        </div>
                        <div className="row justify-content-center">
                            <h3>Training Plan</h3>
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
                                                    <td><b>{this.state.currentPlanDates[index]}</b></td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <input className="training_col" type="number" name="mondayEdit" value={this.state.mondayEdit} onChange={this.handleChange}></input>:
                                                        <React.Fragment>
                                                            {week[0]}
                                                        </React.Fragment>
                                                        }
                                                    </td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <input className="training_col" type="number" name="tuesdayEdit" value={this.state.tuesdayEdit} onChange={this.handleChange}></input>:
                                                        <React.Fragment>
                                                            {week[1]}
                                                        </React.Fragment>
                                                        }
                                                    </td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <input className="training_col" type="number" name="wednesdayEdit" value={this.state.wednesdayEdit} onChange={this.handleChange}></input>:
                                                        <React.Fragment>
                                                            {week[2]}
                                                        </React.Fragment>
                                                        }
                                                    </td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <input className="training_col" type="number" name="thursdayEdit" value={this.state.thursdayEdit} onChange={this.handleChange}></input>:
                                                        <React.Fragment>
                                                            {week[3]}
                                                        </React.Fragment>
                                                        }
                                                    </td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <input className="training_col" type="number" name="fridayEdit" value={this.state.fridayEdit} onChange={this.handleChange}></input>:
                                                        <React.Fragment>
                                                            {week[4]}
                                                        </React.Fragment>
                                                        }
                                                    </td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <input className="training_col" type="number" name="saturdayEdit" value={this.state.saturdayEdit} onChange={this.handleChange}></input>:
                                                        <React.Fragment>
                                                            {week[5]}
                                                        </React.Fragment>
                                                        }
                                                    </td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <input className="training_col" type="number" name="sundayEdit" value={this.state.sundayEdit} onChange={this.handleChange}></input>
                                                        :
                                                        <React.Fragment>
                                                            {week[6]}
                                                        </React.Fragment>
                                                        }
                                                    </td>
                                                    <td>
                                                        {this.state.inEditMode.status && this.state.inEditMode.rowKey === index?
                                                        <React.Fragment>
                                                            {this.state.totalEdit}
                                                        </React.Fragment>:
                                                        <React.Fragment>
                                                            {week[7]}
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

export default AddPlan;
