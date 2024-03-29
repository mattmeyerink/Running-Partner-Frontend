import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import "./components.css";

interface RunStatisticsModalProps {
  runs: any;
}

class RunStatisticsModal extends Component<RunStatisticsModalProps> {
  /**
   * Calculates the statistics to display in the modal. Current statistics
   * include total runs, total miles, average run length, and longest run
   * @returns Object with all of the statistics variables in the card
   */
  calculateStatistics() {
    let totalMiles = 0;
    const totalRuns = this.props.runs.length;
    let averageRunMiles = 0;
    let longestRun = 0;
    for (let i = 0; i < this.props.runs.length; i++) {
      totalMiles += this.props.runs[i].distance;
      if (this.props.runs[i].distance > longestRun) {
        longestRun = this.props.runs[i].distance;
      }
    }
    if (totalRuns !== 0) {
      averageRunMiles = totalMiles / totalRuns;
    }

    const statistics = {
      totalMiles: totalMiles,
      totalRuns: totalRuns,
      averageRunMiles: averageRunMiles.toFixed(2),
      longestRun: longestRun
    }

    return statistics;
  }

  render() {
    const { totalMiles, totalRuns, averageRunMiles, longestRun } = this.calculateStatistics();
    return(
      <Card className="text-left">
        <Card.Header>
          <h3>Run Statistics</h3>
        </Card.Header>
        <Card.Body>
          <Card.Text className="pad-da-stats">
            Runs Completed: {totalRuns}
          </Card.Text>
          <Card.Text className="pad-da-stats">
            Total Miles: {totalMiles} Miles
          </Card.Text>
          <Card.Text className="pad-da-stats">
            Average Miles Per Run: {averageRunMiles} Miles
          </Card.Text>
          <Card.Text className="pad-da-stats">
            Longest Run: {longestRun}
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default RunStatisticsModal;
