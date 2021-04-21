import React, { Component } from "react";
import moment from "moment";
import Config from "../config";
import "../index.css";
import running_shoes from "../images/running_shoes.jpeg";
import rest_day_beach from "../images/rest_day_beach.jpeg";

/**
 * Class to handle processing for today's run on the dashboard
 */
class TodaysRun extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activePlan: false,
      planData: {},
      activePlanRun: null,
    };

    this.getTodaysRun = this.getTodaysRun.bind(this);
  }

  componentDidMount() {
    // Prepare headers for the request
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.props.userData.token,
    });

    // Only send the request of the person has an active plan set
    if (this.props.userData.active_plan !== -1) {
      fetch(
        Config.rpAPI +
          `/training_plans/custom_plan/${this.props.userData.active_plan}`,
        {
          methods: "GET",
          headers: myHeaders,
        }
      )
        .then((response) => response.json())
        .then((data) =>
          this.setState({
            planData: data,
            activePlan: true,
          })
        )
        .catch((error) => console.error(error));
    }
  }

  /*
   * Get todays run length from active plan
   */
  getTodaysRun() {
    if (this.state.activePlan) {
      // Pull the active plan from state and create a week by week array
      const activePlan = this.state.planData.plan;
      const activePlanArr = activePlan.split("-");

      // Get the start date of the first week and the last week
      const firstWeekStart = activePlanArr[0].split(",")[0];
      const lastWeekStart = activePlanArr[activePlanArr.length - 1].split(
        ","
      )[0];

      // Split dates in array to use in creating moment objects
      const firstWeekStartArr = firstWeekStart.split("/");
      const lastWeekStartArr = lastWeekStart.split("/");

      // Create moment objects with first and last week moments
      const firstWeekStartMoment = moment({
        year: parseInt(firstWeekStartArr[2]),
        month: parseInt(firstWeekStartArr[0] - 1),
        day: parseInt(firstWeekStartArr[1]),
      });
      firstWeekStartMoment.subtract(1, "days");
      const lastWeekStartMoment = moment({
        year: parseInt(lastWeekStartArr[2]),
        month: parseInt(lastWeekStartArr[0] - 1),
        day: parseInt(lastWeekStartArr[1]),
      });
      lastWeekStartMoment.add(7, "days");

      // Check if today is within the range of the active plan dates
      if (
        moment().isAfter(firstWeekStartMoment) &&
        moment().isBefore(lastWeekStartMoment)
      ) {
        for (let i = 0; i < activePlanArr.length; i++) {
          // Split up the string of the current week
          const currentWeekArr = activePlanArr[i].split(",");

          // Gather the start date for the week and put it into an array
          const weekStartDate = currentWeekArr[0];
          const weekStartDateArr = weekStartDate.split("/");

          // Create moments for the start of the week and for the end of the week
          const weekStartDateMoment = moment({
            year: parseInt(weekStartDateArr[2]),
            month: parseInt(weekStartDateArr[0] - 1),
            day: parseInt(weekStartDateArr[1]),
          });
          weekStartDateMoment.subtract(1, "days");
          const weekEndDateMoment = moment({
            year: parseInt(weekStartDateArr[2]),
            month: parseInt(weekStartDateArr[0] - 1),
            day: parseInt(weekStartDateArr[1]),
          });
          weekEndDateMoment.add(7, "days");

          // Check if todays run is within this week
          if (
            moment().isAfter(weekStartDateMoment) &&
            moment().isBefore(weekEndDateMoment)
          ) {
            weekStartDateMoment.add(1, "days");

            // Possible easier way to do this. Determine which day of the week today is and pull that
            // value from the plan array
            let j = 1;
            while (j < 8) {
              // Pull the ints for the current day, month, year
              const currentDay = moment().day();
              const currentMonth = moment().month();
              const currentYear = moment().year();

              // Pull the ints for the current day in the plan's date, month, year
              const planDay = weekStartDateMoment.day();
              const planMonth = weekStartDateMoment.month();
              const planYear = weekStartDateMoment.year();

              if (
                currentDay === planDay &&
                currentMonth === planMonth &&
                currentYear === planYear
              ) {
                return parseFloat(currentWeekArr[j]);
              }
              weekStartDateMoment.add(1, "days");
              j++;
            }
          }
        }
      }
    }
    return null;
  }

  render() {
    const activeRun = this.getTodaysRun();

    return (
      <React.Fragment>
        <div className="row justify-content-center">
          <div className="weather_card">
            <div className="row justify-content-center">
              <h3>Today's Run</h3>
            </div>
            <div className="row justify-content-center">
              {activeRun === null || activeRun === 0 ? (
                <React.Fragment>
                  <h5 className="training_run_spacing">No Run Today!</h5>
                  <img
                    src={rest_day_beach}
                    className="img-fluid training_run_spacing"
                    alt="oops"
                  />
                  <p className="trianing_run_spacing">Have a nice rest day!</p>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <h5 className="training_run_spacing">{activeRun} Miles</h5>
                  <img
                    src={running_shoes}
                    className="img-fluid border border-dark training_run_spacing"
                    alt="oops"
                  />
                  <p className="training_run_spacing">
                    Strap on your shoes and get out there!
                  </p>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TodaysRun;
