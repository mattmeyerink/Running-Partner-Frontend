import React, { Component } from "react";
import Container from "react-bootstrap/Container";
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
        <Navbar fixed="bottom" className="footer_wrapper">
          <Col>
            <h5>Running Partner: A Wizard Boy Production</h5>
          </Col>
          <Col className="text-right">
            <a href="https://github.com/mattmeyerink">
              <Image
                roundedCircle
                src={GitHubLogo}
                width="50px"
                className="footer_image"
              />
            </a>
            <a href="https://www.linkedin.com/in/matthew-meyerink-98b6071bb/">
              <Image
                roundedCircle
                fluid
                src={LinkedInLogo}
                width="50px"
                className="footer_image"
              />
            </a>
            <a href="mailto: meyerink@umich.edu">
              <Image
                roundedCircle
                fluid
                src={GmailLogo}
                width="50px"
                className="footer_image"
              />
            </a>
          </Col>
        </Navbar>
      </Container>
    );
  }
}

export default Footer;
