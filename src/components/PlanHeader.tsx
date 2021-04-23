import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./components.css";

interface PlanHeaderProps {
  id: number;
  race_name: string;
  difficulty: string;
  plan_length: number;
  frequency: number;
}

/**
 * Class to display the header information for pre made training plans
 */
class PlanHeader extends Component {
  render() {
    const {race_name, difficulty, plan_length, frequency, id } = this.props as PlanHeaderProps;
    return (
      <React.Fragment>
        <div className="col-md-8 border border-secondary training_plan_card">
          <Link to={`/training_plans/${id}`}>
            <div className="row">
              <div className="col-md-6">
                <strong>
                  {race_name} - {difficulty}
                </strong>
              </div>
              <div className="col-md-3 offset-3">
                <p>
                  {plan_length} weeks - {frequency}{" "}
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
