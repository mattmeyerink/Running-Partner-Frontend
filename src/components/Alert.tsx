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
        <Alert.Heading>This is an alert!</Alert.Heading>
        This is the normal alert message!
      </Alert>
    );
  }
}

export default AlertBanner;
