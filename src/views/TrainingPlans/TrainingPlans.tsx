import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Carousel from "react-bootstrap/Carousel";
import Image from "react-bootstrap/Image";
import GeneralPlanCardCollection from "../../components/GeneralPlanCardCollection";
import CustomPlanImage from "../../images/CustomPlan.jpeg";
import HalfMarathonImage from "../../images/HalfMarathon.jpeg";
import MarathonImage from "../../images/Marathon.jpeg";
import Config from "../../config";
import "../../index.css";

interface TrainingPlanProps {
  setCurrentPage(page: string): void;
  userData: any;
  userAuthenticated: boolean;
}

interface TrainingPlanState {
  training_plans?: any;
  loading?: boolean;
}

/**
 * Class that displays all of the available training plans
 */
class TrainingPlan extends Component<TrainingPlanProps, TrainingPlanState> {
  constructor(props: TrainingPlanProps) {
    super(props);

    this.state = {
      training_plans: [],
      loading: true,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // Set current page to allTraining Plans for the nav bar
    this.props.setCurrentPage("allTrainingPlans");

    // Set current path in local storage
    localStorage.setItem("currentPath", "/training_plans");

    // Prepare headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Send the API request to gather all of the plan data
    fetch(Config.rpAPI + "/training_plans/all_plans", {
      method: "GET",
      headers: myHeaders,
    })
      .then((result) => result.json())
      .then((data) => this.setState({ training_plans: data, loading: false }))
      .catch((error) => console.error(error));
  }

  handleChange(event: any) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({ [name]: value });
  }

  render() {
    return (
      <React.Fragment>
        {this.props.userAuthenticated ? (
          <React.Fragment>
            {this.state.loading ? (
              <div className="row justify-content-center">
                <h1 className="white_text">
                  Loading <Spinner animation="border" variant="light" />
                </h1>
              </div>
            ) : (
              <Container fluid>
                <Row className="text-center">
                  <Col className="carousel_margin">
                    <Carousel fade>
                      <Carousel.Item>
                        <Link to="/custom_plan">
                          <Image fluid src={CustomPlanImage} />
                          <Carousel.Caption>
                            <h3>Custom Training Plan</h3>
                            <p>
                              Create a custom training plan to suit your exact
                              needs!
                            </p>
                          </Carousel.Caption>
                        </Link>
                      </Carousel.Item>
                      <Carousel.Item>
                        <Link to="/training_plans/3">
                        <Image fluid src={HalfMarathonImage} />
                        <Carousel.Caption>
                          <h3>Half Marathon - Beginner</h3>
                          <p>
                            This beginner plan is the perfect ramp up into your
                            first half marathon!
                          </p>
                        </Carousel.Caption>
                        </Link>
                        
                      </Carousel.Item>
                      <Carousel.Item>
                      <Link to="/training_plans/1">
                        <Image fluid src={MarathonImage} />
                        <Carousel.Caption>
                          <h3>Marathon - Beginner</h3>
                          <p>
                            Ready to take the leap into your first full? This
                            plan has you covered!
                          </p>
                        </Carousel.Caption>
                        </Link>
                      </Carousel.Item>
                    </Carousel>
                  </Col>
                </Row>
                <Row>
                  <GeneralPlanCardCollection trainingPlans={this.state.training_plans} />
                </Row>
              </Container>
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

export default TrainingPlan;
