import React, { Component } from "react";
import "../../index.css";

class CustomPlan extends Component {
  constructor() {
    super();
    this.state = {
      numberOfWeeks: 5
    };

    this.changeNumberOfWeeks = this.changeNumberOfWeeks.bind(this);
  }

  /*
   * Method to change the number of weeks of the plan
   */
  changeNumberOfWeeks(event) {
    // Gather determine which button was pressed
    const action = event.target.name

    // Adjust the nubmer of weeks in state accordingly
    this.setState( previousState => {
      if (action === "plus") {
        return { numberOfWeeks: previousState.numberOfWeeks + 1 };
      } else {
        return { numberOfWeeks: previousState.numberOfWeeks - 1};
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="row justify-content-center">
          <h1 className="white_text">Custom Training Plan</h1>
        </div>
        <div className="row justify-content-center">
          <h3 className="white_text custom_plan_button">Number of Weeks</h3>
          <button onClick={this.changeNumberOfWeeks} name="plus" className="btn btn-success custom_plan_button"><b>+</b></button>
          <button onClick={this.changeNumberOfWeeks} name="minus" className="btn btn-success custom_plan_button"><b>-</b></button>
        </div>
        <div className="row justify-content-center">
          <h3 className="white_text">{this.state.numberOfWeeks}</h3>
        </div>
      </React.Fragment>
    )
  }
}

export default CustomPlan;
