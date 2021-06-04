import React, { Component } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";

interface GeneralPlanCardProps {
  plan: any;
}

class GeneralPlanCard extends Component<GeneralPlanCardProps> {
  render() {
    return (
      <Card className="hvr-grow">
        <Link to={`/training_plans/${this.props.plan.id}`} className="black_link">
          <Card.Body>
            <Card.Title>
              {this.props.plan.difficulty} {this.props.plan.race_name} Plan
            </Card.Title>
            <Card.Text>Duration: {this.props.plan.plan_length} weeks</Card.Text>
            <Card.Text>
              Frequency: {this.props.plan.frequency} runs per week
            </Card.Text>
            <Card.Text>Distance: {this.props.plan.race_length} miles</Card.Text>
          </Card.Body>
        </Link>
      </Card>
    );
  }
}

export default GeneralPlanCard;
