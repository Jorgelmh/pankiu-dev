import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "components/templates/home";
import Signup from "components/templates/signup";
import "./styles/theme/hackaton.css";
import GlobalStyles from "./styles/global";
import Profile from "components/templates/profile"
import Mood from "components/templates/mood"
import Notification from "components/templates/notification"
import Chats from "components/templates/chats"
import Chat from "components/templates/chats/chat"
import Layout from 'components/templates/layout'
import Login from 'components/templates/login'
function App() {
  return (
    <Router>
       <GlobalStyles />
       <Layout>

      <Switch>
        <Route exact path="/">
         
          <Home />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/mood">
          <Mood/>
        </Route>
        <Route exact path="/notification">
          <Notification/>
        </Route>
        <Route exact path="/chats">
          <Chats />
        </Route>
        <Route exact path="/chats/chat">
          <Chat />
        </Route>
      </Switch>
      </Layout>

    </Router>
  );
}

export default App;
