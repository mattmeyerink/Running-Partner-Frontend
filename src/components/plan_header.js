import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./components.css";

class PlanHeader extends Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-md-8 border border-secondary training_plan_card">
          <Link to={`/training_plans/${this.props.id}`}>
            <div className="row">
              <div className="col-md-6">
                <strong>
                  {this.props.race_name} - {this.props.difficulty}
                </strong>
              </div>
              <div className="col-md-3 offset-3">
                <p>
                  {this.props.plan_length} weeks - {this.props.frequency}{" "}
                  runs/week
                </p>
              </div>
            </div>
          </Link>
        </div>
      </React.Fragment>
    );
  }
}

export default PlanHeader;
