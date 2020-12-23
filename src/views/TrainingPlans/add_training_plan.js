import React, {Component} from 'react';
import '../../index.css'

class AddPlan extends Component {
    constructor() {
        super();

        this.state = {
            loading: true,
            planData: {},
            final_plan: "",
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
            totalEdit: null
        }

        this.convertToTable = this.convertToTable.bind(this);
        this.editTable = this.editTable.bind(this);
        this.saveTable = this.saveTable.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    // Gather the individual training plan
    componentDidMount(){
        fetch(`http://127.0.0.1:5000/training_plans/${this.props.match.params.id}`)
            .then(result => result.json())
            .then(data => this.setState({planData: data, loading: false}))
            .catch(error => console.error(error))
    }

    // Converts the plan in state to an array that can be mapped to a table when rendered
    convertToTable() {
        var planOutput = []
        const plan = this.state.planData.plan;
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
        planData: {
            plan: outputPlan
        }
    })
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({[name]: value});
    }

    render() {
        var planData = []
        if (!this.state.loading) {
            planData = this.convertToTable();
        }

        return (
            <React.Fragment>
                {this.state.loading ?
                <React.Fragment>
                    <div className="row justify-content-center">
                        <h1>Loading...</h1>
                    </div>
                </React.Fragment>
                :
                <React.Fragment>
                    <div className="col-md-10">
                        <table className="table">
                            <tbody>
                                <tr>
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
                </React.Fragment>
                }
            </React.Fragment>
            
        )
    }
}

export default AddPlan;
