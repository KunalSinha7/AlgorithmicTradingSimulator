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
  InputGroupAddon,
  Alert
} from "reactstrap";
import history from "./history";
import MyCard from "./MyCards";

axios.defaults.baseURL = "http://52.14.66.192:9090";

class Trading extends Component {
  constructor(props) {
    super(props);
    if (props.match.params.jwt == null || props.match.params.jwt == "") {
      history.push("/login");
    }
    this.child = React.createRef();

    this.state = {
      collapsed: true,
      jwt: props.match.params.jwt,
      numItems: 1,
      cardStates: [],
      transactionCards: [],
      showAlert: false,
      showSuccessAlert: false,
      alertMsg: "",
      alertNum: "",
      counter: 0
    };
  }

  dismissSuccessAlert = () => {
    this.setState({ showSuccessAlert: false });
  };

  dismissAlert = () => {
    this.setState({ showAlert: false });
  };

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  handleAdd = () => {
    this.setState(
      {
        numItems: this.state.numItems + 1
      },
      () => this.componentDidMount()
    );
  };

  handleRemove = () => {
    if (this.state.numItems > 1) {
      this.setState(
        {
          numItems: this.state.numItems - 1
        },
        () => this.componentDidMount()
      );
    }
  };

  handleCardState = (index, singleState) => {
    let oldStates = this.state.cardStates;
    oldStates[index] = singleState;
    this.setState({
      cardStates: oldStates
    });
  };

  //   function function1(param, callback) {
  //     return new Promise(function (fulfill, reject){
  //         //do stuff
  //         fulfill(result); //if the action succeeded
  //         reject(error); //if the action did not succeed
  //     });
  // }
  verifyTransactions = states => {
    if (states.length > this.state.counter) {
      let that = this;
      axios
        .post("/VERIFY-TRADE	", {
          token: this.state.jwt,
          currA: states[this.state.counter].currA,
          currB: states[this.state.counter].currB,
          amt: states[this.state.counter].valAmt
        })
        .then(response => {
          if (response.data.amt == null || response.data.amt == "") {
            console.log("failed");
            that.setState(
              {
                showAlert: true,
                alertMsg: response.data.message,
                alertNum: parseInt(this.state.counter, 10) + 1
              },
              () => {
                console.log("failed2");
              }
            );
          } else {
            this.submitFunction1(states)
          }
        })
        .catch(error => {
          console.log(error);
        });
     } else {
      this.setState({
        counter: 0,
        showSuccessAlert: true
      });    }
  };

  submitFunction1 = (states) => {
    let that = this;
    axios
    .post("/TRADE-ONE", {
      token: this.state.jwt,
      currA: this.state.cardStates[this.state.counter].currA,
      currB: this.state.cardStates[this.state.counter].currB,
      amt: this.state.cardStates[this.state.counter].valAmt
    })
    .then(response => {
      let cards = that.state.transactionCards;
      cards.splice(that.state.counter,1);
      that.setState({ counter: that.state.counter + 1, transactionCards: cards, numItems:that.state.numItems-1 }, () =>{
        that.render();
        that.verifyTransactions(states);
      });
    })
    .catch(error => {
      console.log(error);
    });
  }

  submitFunction = () => {
    console.log("SUBMITTING BEGINNING");
    for (let onestate in this.state.cardStates) {
      let flag = false;
      console.log("trading loop");
      axios
        .post("/TRADE-ONE", {
          token: this.state.jwt,
          currA: this.state.cardStates[onestate].currA,
          currB: this.state.cardStates[onestate].currB,
          amt: this.state.cardStates[onestate].valAmt
        })
        .then(response => {
          console.log(response.data);
          console.log("hello");
          this.setState({
            counter: 0,
            showSuccessAlert: true
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  submitTransaction = () => {
    this.setState({
      showAlert: false,
      showSuccessAlert: false
    });
    console.log(this.verifyTransactions(this.state.cardStates));
  };

  componentDidMount = () => {
    let cards = [];
    for (let i = 0; i < this.state.numItems; i++) {
      cards.push(
        <MyCard
          handleCardState={this.handleCardState}
          myKey={i}
          {...this.state}
        />
      );
    }
    this.setState({ transactionCards: cards });
  };

  printThings=()=>{
    let things=[];
    for(let i in this.state.transactionCards){
      things.push(this.state.transactionCards[i]);
    }
    return things;
  }

  render() {
    console.log(this.state.transactionCards);
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
        <Container className="whole">
          <Row>
            <Col>
              <h3>Make a Trade</h3>
            </Col>
          </Row>
          <Alert
            color="danger"
            isOpen={this.state.showAlert}
            toggle={this.dismissAlert}
          >
            Error with trade #{this.state.alertNum} <br /> {this.state.alertMsg}
          </Alert>
          <Alert
            color="success"
            isOpen={this.state.showSuccessAlert}
            toggle={this.dismissSuccessAlert}
          >
            Trades Successful
          </Alert>
          {this.printThings()}
          <Row style={{ marginBottom: "2vh" }}>
            <Col className="cardCol">
              <Button color="danger" onClick={() => this.handleRemove()}>
                Remove
              </Button>{" "}
              <Button color="success" onClick={() => this.handleAdd()}>
                Add
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                style={{ margin: "1vmin" }}
                onClick={() => this.submitTransaction()}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Trading;
