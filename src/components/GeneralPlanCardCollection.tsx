import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import CardColumns from "react-bootstrap/CardColumns";
import GeneralPlanCard from "./GeneralPlanCard";

interface GeneralPlanCollectionProps {
  trainingPlans: any;
}

class GeneralPlanCollection extends Component<GeneralPlanCollectionProps> {
  render() {
    return (
      <Container fluid>
        <CardColumns>
          {this.props.trainingPlans.map((plan: any) => (
            <React.Fragment key={plan.id}>
              <GeneralPlanCard plan={plan}/>
            </React.Fragment>
          ))}
        </CardColumns>
      </Container>
    );
  }
}

export default GeneralPlanCollection;
