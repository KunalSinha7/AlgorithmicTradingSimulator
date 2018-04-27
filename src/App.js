import React, { Component } from "react";
import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Main from "./Main";
import Trading from "./Trading";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import Graphs from "./Graphs"

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jwt: ""
    };
  }

  verifyJWT = () => {
    if (this.state.jwt == null || this.state.jwt == "") {
      return false;
    } else {

      return false;
    }
  };

  requireAuth = (nextState, replace) => {
    console.log(nextState);
    if (!this.verifyJWT()) {
      replace({
        pathname: "/login"
      });
    }
  };

  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/home/:jwt" component={Main} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/profile/:jwt" component={Profile}/>
          <Route path="/trading/:jwt" component={Trading} />
          <Route path="/graphs/:currency/:jwt" component={Graphs}/>
          <Route path="/graphs/:currency" component={Graphs}/>
          <Redirect from="*" to="/" />
        </Switch>
      </div>
    );
  }
}

export default App;
