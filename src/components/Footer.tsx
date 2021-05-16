import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Navbar from "react-bootstrap/Navbar";
import GitHubLogo from "../images/GitHubLogo.png";
import LinkedInLogo from "../images/LinkedInLogo.png";
import GmailLogo from "../images/GmailLogo.jpeg";
import "./components.css";

class Footer extends Component {
  render() {
    return (
      <Container>
        <Navbar fixed="bottom">
          <Col className="white_text">
            <h5>Running Partner: A Wizard Boy Production</h5>
          </Col>
          <Col className="text-right">
            <Image
              roundedCircle
              src={GitHubLogo}
              width="50px"
              className="footer_image"
            />
            <Image
              roundedCircle
              fluid
              src={LinkedInLogo}
              width="50px"
              className="footer_image"
            />
            <Image
              roundedCircle
              fluid
              src={GmailLogo}
              width="50px"
              className="footer_image"
            />
          </Col>
        </Navbar>
      </Container>
    );
  }
}

export default Footer;
