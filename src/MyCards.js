import React, { Component } from "react";
import "./App.css";
import "./Trading.css";
import FaArrowRight from "react-icons/lib/fa/arrow-right";
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
  InputGroupAddon
} from "reactstrap";

axios.defaults.baseURL = "http://52.14.66.192:9090";

class Main extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      jwt: props.jwt,
      currencyList: [
        "usd",
        "eur",
        "jpy",
        "gbp",
        "aud",
        "cad",
        "chf",
        "cny",
        "sek",
        "mxn",
        "nzd",
        "sgd",
        "hkd",
        "nok",
        "krw",
        "try",
        "inr",
        "rub",
        "brl",
        "zar",
        "dkk",
        "pln",
        "twd",
        "thb",
        "myr"
      ],
      currA: "usd",
      currB: "usd",
      valAmt: 0.0,
      disabled: false,
      invalid: false
    };

    if (props.disabled == true) {
      this.setState({
        disabled: true
      });
    }
  }

  onAmountChange = event => {
    if (event.target.value < 0) {
      this.setState(
        {
          valAmt: 0
        },
        () => {
          this.props.handleCardState(this.props.myKey, this.state);
        }
      );
    } else {
      this.setState(
        {
          valAmt: event.target.value
        },
        () => {
          this.props.handleCardState(this.props.myKey, this.state);
          axios
            .post("/CONVERT	", {
              token: this.state.jwt,
              currA: this.state.currA,
              currB: this.state.currB,
              amt: this.state.valAmt
            })
            .then(response => {
              console.log(response.data);
              if (response.data.amt == null || response.data.amt == "") {
                this.setState({ invalid: true });
              } else {
                this.setState({
                  valNewAmt: parseFloat(response.data.amt).toFixed(2)
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      );
    }
  };

  handleInputA = event => {
    this.setState(
      {
        currA: event
      },
      () => {
        this.props.handleCardState(this.props.myKey, this.state);
        axios
          .post("/CONVERT", {
            token: this.state.jwt,
            currA: this.state.currA,
            currB: this.state.currB,
            amt: this.state.valAmt
          })
          .then(response => {
            if (response.data.amt == null || response.data.amt == "") {
              this.setState({ invalid: true });
            } else {
              this.setState({
                valNewAmt: parseFloat(response.data.amt).toFixed(2)
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    );
  };

  handleInputB = event => {
    this.setState(
      {
        currB: event
      },
      () => {
        this.props.handleCardState(this.props.myKey, this.state);
        axios
          .post("/CONVERT", {
            token: this.state.jwt,
            currA: this.state.currA,
            currB: this.state.currB,
            amt: this.state.valAmt
          })
          .then(response => {
            if (response.data.amt == null || response.data.amt == "") {
              this.setState({ invalid: true });
            } else {
              this.setState({
                valNewAmt: parseFloat(response.data.amt).toFixed(2)
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    );
  };

  getInfo = () => {
    let obj = {
      currA: this.state.currA,
      currB: this.state.currB,
      amount: this.state.valAmt
    };
    return obj;
  };

  render() {
    let currencies = [];
    for (let c in this.state.currencyList) {
      currencies.push(
        <option value={this.state.currencyList[c]}>
          {this.state.currencyList[c].toUpperCase()}
        </option>
      );
    }

    return (
      <Row>
        <Col className="cardCol">
          <Card style={{ display: "inline-flex", padding: "2vh" }}>
            <h5 style={{ textAlign: "left" }}>#{this.props.myKey + 1}</h5>
            <CardText>
              <Form style={{ display: "inline-flex" }}>
                <FormGroup>
                  <Input
                    type="select"
                    name="select"
                    id="buysell"
                    value={this.state.currA}
                    disabled={this.state.disabled}
                    onChange={e => this.handleInputA(e.target.value)}
                  >
                    {currencies}
                  </Input>
                </FormGroup>
                <FaArrowRight
                  size={20}
                  style={{
                    marginTop: "1.5vmin",
                    marginLeft: "2vmin",
                    marginRight: "2vmin"
                  }}
                />
                <FormGroup>
                  <Input
                    type="select"
                    name="select"
                    id="currency"
                    value={this.state.currB}
                    onChange={e => this.handleInputB(e.target.value)}
                  >
                    {currencies}
                  </Input>
                </FormGroup>
              </Form>
            </CardText>
            <CardText style={{ display: "inline-flex" }}>
              <Input
                placeholder="Amount"
                type="number"
                step="0.01"
                value={this.state.valAmt}
                onChange={this.onAmountChange}
              />
              <FaArrowRight
                size={20}
                style={{
                  marginTop: "1.5vmin",
                  marginLeft: "2vmin",
                  marginRight: "2vmin"
                }}
              />
              <Input
                placeholder="Amount"
                type="number"
                step="0.01"
                value={this.state.valNewAmt}
                disabled={true}
              />
            </CardText>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Main;
