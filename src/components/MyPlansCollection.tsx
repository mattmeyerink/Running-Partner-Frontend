import React, { Component } from "react";
import CardColumns from "react-bootstrap/CardColumns";
import Container from "react-bootstrap/Container";
import MyPlanCard from "./MyPlanCard";

interface MyPlansCollectionProps {
  trainingPlans: any;
  activePlanId: number;
  userData: any;
  getTrainingPlans(): void;
}

class MyPlansCollection extends Component<MyPlansCollectionProps> {
  constructor(props: MyPlansCollectionProps) {
    super(props);

    this.getStartDate = this.getStartDate.bind(this);
    this.getEndDate = this.getEndDate.bind(this);
  }

  /**
   * Pulls the start date out of the passed trianing plan
   * @param plan Contains string of the entire training plan
   * @returns String representing the start date
   */
  getStartDate(plan: any): string {
    const planSplit = plan.split("-");
    const startDate = planSplit[0].split(",")[0];

    return startDate;
  }

  /**
   * Pulls the end date out of the passed training plan
   * @param plan Contains the string of the entire training plan
   * @returns String representing the end date
   */
  getEndDate(plan: any): string {
    const planSplit = plan.split("-");
    const endDate = planSplit[planSplit.length - 1].split(",")[0];

    return endDate;
  }

  render() {
    return (
      <Container fluid>
        <CardColumns>
          {this.props.trainingPlans.map((plan: any) => (
            <React.Fragment key={plan.id}>
              {plan.id !== this.props.activePlanId && (
                <MyPlanCard plan={plan} userData={this.props.userData} getTrainingPlans={this.props.getTrainingPlans}/>
              )}
            </React.Fragment>
          ))}
        </CardColumns>
      </Container>
    );
  }
}

export default MyPlansCollection;
