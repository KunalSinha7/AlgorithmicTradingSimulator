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

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: true,
      email: "",
      password: "",
      emailFailed: { invalid: false },
      passwordFailed: { invalid: false }
    };
  }

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };


  login = event => {
    console.log(this.state.email);
    if (this.state.email.length > 0 && this.state.password.length > 0) {
      let encryptedPass = crypto
        .createHmac("sha256", secret)
        .update(this.state.password)
        .digest("hex");

      axios
        .post("/LOGIN", {
          email: this.state.email,
          password: encryptedPass
        })
        .then(response => {
          console.log(response.data);
          if (response.data.status == false) {
            //ERROR
            if (response.data.message == "INCORRECT-EMAIL") {
              this.setState({
                emailFailed: { invalid: true },
                passwordFailed: { invalid: true },
                email: "",
                password: ""
              });
              //TODO: FIX ALERT
              <Alert color="danger">Incorrect Email</Alert>;
            } else if (response.data.message == "INCORRECT-PASSWORD") {
              this.setState({
                passwordFailed: { invalid: true },
                password: ""
              });
              //TODO: FIX ALERT
              <Alert color="danger">Incorrect Password</Alert>;
            }
          } else {
            //ROUTE TO TRADING PAGE
            history.push("/trading/" + response.data.token);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }

    if (this.state.email.length <= 0) {
      this.setState({
        emailFailed: { invalid: true },
        email: "",
        password: ""
      });
    } else if (this.state.password.length <= 0) {
      this.setState({ passwordFailed: { invalid: true }, password: "" });
    }
    event.preventDefault();
  };

  handleEmail = email => {
    this.setState({
      email: email
    });
  };

  handlePassword = password => {
    this.setState({
      password: password
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
              <h3>LOGIN</h3>
              <Form onSubmit={this.login}>
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
                <Button>Submit</Button>
              </Form>
            </Jumbotron>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Login;
