import React, { Component } from "react";
import Alert from "react-bootstrap/Alert";

interface AlertBannerProps {
  show: boolean;
  variant: string;
  header: string;
  message: string;
}

class AlertBanner extends Component<AlertBannerProps> {
  render() {
    return(
      <Alert show={this.props.show} variant={this.props.variant} transition dismissible>
        <Alert.Heading>{this.props.header}</Alert.Heading>
        <p>{this.props.message}</p>
      </Alert>
    );
  }
}

export default AlertBanner;
