import React, { Component } from "react";
import ReactDOM from "react-dom";
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
import { LineChart, Line, CartesianGrid, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// import Chart from "react-d3-core";
// import LineChart from "react-d3-basic";
// var Chart = require("react-d3-core").Chart;
// var LineChart = require("react-d3-basic").LineChart;

axios.defaults.baseURL = "http://52.14.66.192:9090";

class Graphs extends Component {
  constructor(props) {
    super(props);
    console.log(props.match);
    let currency1 = props.match.params.currency;
    if (
      props.match.params.currency == null ||
      props.match.params.currency == ""
    ) {
      history.push("/login");
    }
    let jwt1 = props.match.params.jwt;
    if (props.match.params.jwt == null || props.match.params.jwt == "") {
      jwt1 = "";
    }

    this.state = {
      jwt: jwt1,
      collapsed: true,
      currency: currency1,
      tableVals: [],
      chartData: {}
    };
    console.log(this.state)
  }

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  componentDidMount = () => {
    axios
      .post("/GET-GRAPH-VALUES", {
        currency: this.state.currency
      })
      .then(response => {
        console.log(response.data);
        let table = this.state.tableVals;
        let url;
        if (this.state.currency == "USD" || this.state.currency == "usd") {
          url = "USD";
        } else {
          url = (
            <a href={"/graphs/" + this.state.currency + "/" + this.state.jwt}>
              {this.state.currency}
            </a>
          );
        }
        let volatilityText = "";
        if (parseFloat(response.data.volatility).toFixed(2) > 0) {
          volatilityText = (
            <td className="text-success">
              {parseFloat(response.data.volatility).toFixed(2)}%
            </td>
          );
        } else if (parseFloat(response.data.volatility).toFixed(2) < 0) {
          volatilityText = (
            <td className="text-danger">
              {parseFloat(response.data.volatility).toFixed(2)}%
            </td>
          );
        } else {
          volatilityText = <td>--</td>;
        }
        let changeText = "";
        if (parseFloat(response.data.change).toFixed(2) > 0) {
          changeText = (
            <td className="text-success">
              {parseFloat(response.data.change).toFixed(2)}%
            </td>
          );
        } else if (parseFloat(response.data.change).toFixed(2) < 0) {
          changeText = (
            <td className="text-danger">
              {parseFloat(response.data.change).toFixed(2)}%
            </td>
          );
        } else {
          changeText = <td>--</td>;
        }
        table.push(
          <tr>
            <th scope="row">{url}</th>
            <td>{parseFloat(response.data.value).toFixed(2)}</td>
            {changeText}
            {volatilityText}
          </tr>
        );
        this.setState({
          tableVals: table,
          chartData: response.data.values
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    console.log(this.props.match.params.jwt)
    console.log(this.state.jwt)
    let nav;
    if (
      this.props.match.params.jwt == null ||
      this.props.match.params.jwt == ""
    ) {
      nav = (
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
      );
    } else {
      nav = (
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
      );
    }

    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/" className="mr-auto">
            Algorithmic Trading Simulator
          </NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse isOpen={!this.state.collapsed} navbar>
            {nav}
          </Collapse>
        </Navbar>
        <Row
          style={{
            paddingLeft: "10vmin",
            paddingRight: "10vmin",
            paddingTop: "2vmin",
            paddingBottom: "5vmin"
          }}
        >
          <Col style={{maxHeight: "60vmin"}}>
            <h3>{this.state.currency}</h3>
            <ResponsiveContainer>
            <LineChart  data={this.state.chartData}>
              <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
              <CartesianGrid stroke="#ccc" />
              <Tooltip />
              <YAxis type="number" domain={[dataMin => parseFloat(dataMin - dataMin / 50).toFixed(2), dataMax => parseFloat(dataMax + dataMax / 50).toFixed(2)]} />
            </LineChart>
            </ResponsiveContainer>
            <Table bordered responsive style={{ marginTop: "2vmin" }}>
              <thead>
                <tr>
                  <th>Currency</th>
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

export default Graphs;
