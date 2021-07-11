import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Config from "../../config";
import "../../index.css";
import Container from "react-bootstrap/Container";
import ActivePlanHeader from "../../components/ActivePlanHeader";
import MyPlansCollection from "../../components/MyPlansCollection";

interface MyPlansProps {
  setCurrentPage(page: string): void;
  userData: any;
  userAuthenticated: boolean;
}

interface MyPlansState {
  training_plans?: any;
  loading: boolean;
  planDeleted: boolean;
  runs?: any;
}

/**
 * This class is responsible for displaying all of a users plans
 */
class MyPlans extends Component<MyPlansProps, MyPlansState> {
  constructor(props: MyPlansProps) {
    super(props);

    this.state = {
      training_plans: [],
      loading: true,
      planDeleted: false,
      runs: []
    };

    this.getTrainingPlans = this.getTrainingPlans.bind(this);
    this.getActivePlan = this.getActivePlan.bind(this);
  }

  componentDidMount() {
    // Set the current page to myTrainingPlans for the nav bar
    this.props.setCurrentPage("myTrainingPlans");

    // Set current path in local storage
    localStorage.setItem("currentPath", "/personal_plan");

    // Prepare headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Gather the users training plans
    fetch(
      Config.rpAPI + `/training_plans/custom_plans/${this.props.userData.id}`,
      {
        method: "GET",
        headers: myHeaders,
      }
    )
      .then((result) => result.json())
      .then((data) => this.setState({ training_plans: data.plans, runs: data.runs, loading: false }))
      .catch((error) => console.error(error));
  }

  /*
   * Method to pass down to the plan headers to re-gather plan info when a plan is deleted
   */
  getTrainingPlans() {
    // Prepare headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Re gather the plan data
    fetch(
      Config.rpAPI + `/training_plans/custom_plans/${this.props.userData.id}`,
      {
        method: "GET",
        headers: myHeaders,
      }
    )
      .then((result) => result.json())
      .then((data) => this.setState({ training_plans: data.plans, runs: data.runs }))
      .catch((error) => console.error(error));
  }

  /*
   * Return the active plan data out of all of the training plans
   */
  getActivePlan() {
    if (!this.state.loading) {
      const trainingPlan = this.state.training_plans;
      for (let i = 0; i < trainingPlan.length; i++) {
        if (trainingPlan[i].id === this.props.userData.active_plan) {
          return trainingPlan[i];
        }
      }
    }
    return null;
  }

  render() {
    const activePlan = this.getActivePlan();

    return (
      <React.Fragment>
        {this.props.userAuthenticated ? (
          <Container fluid>
            <h1 className="white_text text-center">My Plans</h1>
            {this.state.loading ? (
              <React.Fragment>
                <h1 className="white_text text-center">
                  Loading <Spinner animation="border" variant="light" />
                </h1>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {this.state.training_plans.length === 0 ? (
                  <React.Fragment>
                    <div className="row justify-content-center">
                      <h3 className="white_text">
                        You are not currently signed up for any training plans.
                      </h3>
                    </div>
                    <div className="row justify-content-center">
                      <h3 className="white_text">
                        Sign up for a plan{" "}
                        <Link to="/training_plans">here</Link>!
                      </h3>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {activePlan !== null ? (
                      <React.Fragment>
                        <div className="row justify-content-center">
                          <ActivePlanHeader
                            activePlan={activePlan}
                            getTrainingPlans={this.getTrainingPlans}
                            userData={this.props.userData}
                          />
                        </div>
                      </React.Fragment>
                    ) : (
                      <React.Fragment></React.Fragment>
                    )}
                    <Row className="plans_collection">
                      <MyPlansCollection
                        trainingPlans={this.state.training_plans}
                        activePlanId={this.props.userData.active_plan}
                        userData={this.props.userData}
                        getTrainingPlans={this.getTrainingPlans}
                      />
                    </Row>
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </Container>
        ) : (
          <React.Fragment>
            <Redirect to="/login" />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default MyPlans;
