import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "components/templates/home";
import Signup from "components/templates/signup";
import "./styles/theme/hackaton.css";
import GlobalStyles from "./styles/global";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <GlobalStyles />
          <Home />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
