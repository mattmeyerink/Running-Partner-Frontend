import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Config from "../../config";
import "../../index.css";

interface SinglePlanProps {
  setCurrentPage(page: string): void;
  match: any;
  userData: any;
  userAuthenticated: boolean;
}

interface SinglePlanState {
   training_plan: any;
   planDetails: any;
   loading: boolean;
}

/**
 * Class to display a single general training plan
 */
class SinglePlan extends Component<SinglePlanProps, SinglePlanState> {
  constructor(props: SinglePlanProps) {
    super(props);

    this.state = {
      training_plan: {},
      planDetails: [],
      loading: true,
    };

    this.convertToTable = this.convertToTable.bind(this);
  }

  componentDidMount() {
    // Set current page to allTraining Plans for the nav bar
    this.props.setCurrentPage("allTrainingPlans");

    // Set current path in local storage
    localStorage.setItem(
      "currentPath",
      `/training_plans/${this.props.match.params.id}`
    );

    // Prepare headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Gather the data for the specific training plan
    fetch(Config.rpAPI + `/training_plans/${this.props.match.params.id}`, {
      method: "GET",
      headers: myHeaders,
    })
      .then((result) => result.json())
      .then((data) => this.setState({ training_plan: data, loading: false }))
      .catch((error) => console.error(error));
  }

  /**
   * Converts the plan in state to an array that can be mapped to a table when rendered]
   */
  convertToTable() {
    const planOutput = [];

    // If the plan has been pulled from the API, handle the data
    if (this.state.training_plan.plan !== undefined) {
      const plan = this.state.training_plan.plan;
      const weeks = plan.split("-");

      for (let i = 0; i < weeks.length; i++) {
        const days = weeks[i].split(",");
        const weekOutput = [];
        let total = 0;
        for (let j = 0; j < days.length; j++) {
          weekOutput.push(days[j]);
          total += parseFloat(days[j]);
        }
        weekOutput.push(total);
        planOutput.push(weekOutput);
      }
    }

    return planOutput;
  }

  render() {
    const training_plan = this.state.training_plan;
    const planData = this.convertToTable();
    return (
      <React.Fragment>
        {this.props.userAuthenticated ? (
          <React.Fragment>
            {this.state.loading ? (
              <div className="row justify-content-center loading_height">
                <h1 className="white_text">
                  Loading <Spinner animation="border" variant="light" />
                </h1>
              </div>
            ) : (
              <React.Fragment>
                <div className="row justify-content-center">
                  <h1 className="white_text">
                    {training_plan.race_name} - {training_plan.difficulty}
                  </h1>
                </div>
                <Row className="justify-content-center">
                  <Col className="text-right white_text">
                    <h5><b>Difficulty:</b> {this.state.training_plan.difficulty}</h5>
                    <h5><b>Duration:</b> {this.state.training_plan.plan_length} weeks</h5>
                  </Col>
                  <Col className="text-left white_text">
                    <h5><b>Goal Distance:</b> {this.state.training_plan.race_length} miles</h5>
                    <h5><b>Frequency:</b> {this.state.training_plan.frequency} runs per week</h5>
                  </Col>
                </Row>
                <Row className="justify-content-center">
                  <Link
                    to={'/training_plans/'}
                    className="btn btn-warning custom_plan_button">
                      Back to Outline
                  </Link>
                  <Link
                      to={`/add_plan/${training_plan.id}`}
                      className="btn btn-success custom_plan_button"
                    >
                      Use Plan
                  </Link>
                </Row>
                <div className="row justify-content-center">
                  <div className="col-md-10">
                    <table className="table background_color">
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
                              <td>
                                <b>{index + 1}</b>
                              </td>
                              <td>{week[0]}</td>
                              <td>{week[1]}</td>
                              <td>{week[2]}</td>
                              <td>{week[3]}</td>
                              <td>{week[4]}</td>
                              <td>{week[5]}</td>
                              <td>{week[6]}</td>
                              <td>
                                <b>{week[7].toFixed(1)}</b>
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Redirect to="/login" />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default SinglePlan;
