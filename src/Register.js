import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  InputGroup,
  InputGroupAddon,
  Jumbotron,
  Alert
} from "reactstrap";
import history from "./history";

const crypto = require("crypto");
const secret = "abcdefg";

axios.defaults.baseURL = "http://52.14.66.192:9090";

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
      email: "",
      password: "",
      confirmPassword: "",
      emailFailed: { invalid: false },
      passwordFailed: { invalid: false },
      confirmPasswordFailed: { invalid: false }
    };
  }

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  register = event => {
    if (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.confirmPassword.length > 0
    ) {
      if (this.state.password != this.state.confirmPassword) {
        this.setState({ confirmPasswordFailed: { invalid: true } });
      }

      this.setState(
        {
          password: crypto
            .createHmac("sha256", secret)
            .update(this.state.password)
            .digest("hex")
        },
        () => {
          axios
            .post("/REGISTER", {
              email: this.state.email,
              password: this.state.password
            })
            .then(response => {
              console.log(response.data);
              if (response.data.status == false) {
                //ERROR
                <Alert color="danger">{response.data.message}</Alert>;
              } else {
                //ROUTE TO LOGIN PAGE
                history.push("/login");
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      );
    }

    if (this.state.email.length <= 0) {
      this.setState({
        emailFailed: { invalid: true },
        email: "",
        password: "",
        confirmPassword: ""
      });
    } else if (this.state.password.length <= 0) {
      this.setState({
        passwordFailed: { invalid: true },
        password: "",
        confirmPassword: ""
      });
    } else if (this.state.confirmPassword.length <= 0) {
      this.setState({
        confirmPasswordFailed: { invalid: true },
        password: "",
        confirmPassword: ""
      });
    }

    event.preventDefault();
  };

  handleEmail = email => {
    console.log(email);
    this.setState({
      email: email
    });
  };

  handlePassword = password => {
    console.log(password);
    this.setState({
      password: password
    });
  };

  handleConfirmPassword = confirmPassword => {
    this.setState({
      confirmPassword: confirmPassword
    });
  };

  render() {
    return (
      <div className="App">
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/" className="mr-auto">
            Algorithmic Trading Simulator
          </NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/login/">Login</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/register/">Register</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <Row style={{ margin: "2vh" }}>
          <Col style={{ display: "flex", justifyContent: "center" }}>
            <Jumbotron style={{ maxWidth: "60vw" }}>
              <h3>REGISTER</h3>
              <Form onSubmit={this.register}>
                <FormGroup style={{ textAlign: "left", minWidth: "50vmin" }}>
                  <Label for="exampleEmail">Email</Label>
                  <Input
                    {...this.state.emailFailed}
                    type="email"
                    name="email"
                    id="exampleEmail"
                    placeholder="example@example.com"
                    value={this.state.email}
                    onChange={e => this.handleEmail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup style={{ textAlign: "left", minWidth: "50vmin" }}>
                  <Label for="examplePassword">Password</Label>
                  <Input
                    {...this.state.passwordFailed}
                    type="password"
                    name="password"
                    id="examplePassword"
                    placeholder="password"
                    value={this.state.password}
                    onChange={e => this.handlePassword(e.target.value)}
                  />
                </FormGroup>
                <FormGroup style={{ textAlign: "left", minWidth: "50vmin" }}>
                  <Label for="examplePassword">Confirm Password</Label>
                  <Input
                    {...this.state.confirmPasswordFailed}
                    type="password"
                    name="confirmPassword"
                    id="exampleConfirmPassword"
                    placeholder="confirm password"
                    value={this.state.confirmPassword}
                    onChange={e => this.handleConfirmPassword(e.target.value)}
                  />
                </FormGroup>
                <Button>Submit</Button>
              </Form>
            </Jumbotron>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Register;
