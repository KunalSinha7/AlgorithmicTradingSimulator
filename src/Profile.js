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
  Table
} from "reactstrap";
import history from "./history";

axios.defaults.baseURL = "http://52.14.66.192:9090";

class Profile extends Component {
  constructor(props) {
    super(props);
    let jwt = props.match.params.jwt;
    if (props.match.params.jwt == null || props.match.params.jwt == "") {
      history.push("/login");
    }

    this.state = {
      collapsed: true,
      jwt: jwt,
      tableVals: [],
      email: ""
    };
  }

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  componentDidMount = () => {
    console.log(this.state.jwt);
    axios
      .post("/GET-USER", {
        token: this.state.jwt
      })
      .then(response => {
        console.log(response.data);
        let values = [];
        for (let curr in response.data.currencies) {
            console.log(curr)
          curr = curr.toUpperCase();
          let changes = parseFloat(response.data.changes[curr] * 100).toFixed(
            2
          );
          let changeText = "";
          if (changes > 0) {
            changeText = <td className="text-success">{changes}%</td>;
          } else if (changes < 0) {
            changeText = <td className="text-danger">{changes}%</td>;
          } else {
            changeText = <td>--</td>;
          }
          let volatility = parseFloat(response.data.volatility[curr]).toFixed(
            2
          );
          let volatilityText = "";
          if (volatility > 0) {
            volatilityText = <td className="text-success">{volatility}%</td>;
          } else if (volatility < 0) {
            volatilityText = <td className="text-danger">{volatility}%</td>;
          } else {
            volatilityText = <td>--</td>;
          }
          let url;
          if (curr == "USD" || curr == "usd") {
            url = "USD"
          } else {
            url = (
              <a href={"/graphs/" + curr + "/" + this.state.jwt}>{curr}</a>
            );
          }
          values.push(
            <tr>
              <th scope="row">{url}</th>
              <td>{parseFloat(response.data.currencies[curr.toLowerCase()]).toFixed(2)}</td>
              <td>{parseFloat(response.data.values[curr]).toFixed(2)}</td>
              {changeText}
              {volatilityText}
            </tr>
          );
        }
        this.setState({
          email: response.data.email,
          tableVals: values
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/" className="mr-auto">
            Algorithmic Trading Simulator
          </NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href={"/home/" + this.state.jwt}>Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href={"/trading/" + this.state.jwt}>Trading</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href={"/profile/" + this.state.jwt}>Profile</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/logout/">Logout</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

        <Row
          style={{
            paddingLeft: "10vmin",
            paddingRight: "10vmin",
            paddingTop: "2vmin",
            paddingBottom: "2vmin"
          }}
        >
          <Col>
            <h3>Profile</h3>
            <Row style={{ textAlign: "left" }}>
              <Col>
                <b>EMAIL: </b>
                <em>{this.state.email}</em>
              </Col>
              {/* <Col>
                <Button>Change Password</Button>
              </Col> */}
            </Row>
          </Col>
        </Row>

        <Row
          style={{
            paddingLeft: "10vmin",
            paddingRight: "10vmin",
            paddingBottom: "5vmin"
          }}
        >
          <Col>
            <Table bordered responsive style={{ marginTop: "2vmin" }}>
              <thead>
                <tr>
                  <th>Currencies</th>
                  <th>Balance</th>
                  <th>Value</th>
                  <th>Percent Change</th>
                  <th>Volatility</th>
                </tr>
              </thead>
              <tbody>{this.state.tableVals}</tbody>
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Profile;
