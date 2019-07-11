import React, { Component } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { PrivateRoute, PublicRoute } from "./components/ArweaveAuth";
import { AppState, UserState } from "./Types";

import { Col, Container, Row } from "react-bootstrap";

import HomeDefault from "./components/HomeDefault";

const mainStyle = {
  width: "100%",
  height: "100%",
  backgroundImage: "linear-gradient(#292929, #191919)",
  backgroundColor: "#191919",
  hotColor: "#F69E4D",
  mainColorAlt: "#fa7d36",
  mainColor: "#F76B1C",
};

export default class App extends Component<{}, AppState> {
  public state = {
    userDetails: {
      loggedIn: false,
      address: "",
      balance: 0,
    },
  };

  public componentRef = React.createRef<any>();

  public updateDimensions() {
    // force it to rerender when the window is resized to make sure qr fits etc
    this.forceUpdate();
  }

  public componentDidMount() {
    document.body.style.backgroundColor = mainStyle.backgroundColor;
    window.addEventListener("resize", this.updateDimensions.bind(this));

  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  public logout(event: React.MouseEvent<HTMLElement, MouseEvent>): void {
    console.log("logOut");
  }

  public loggedin(logged: boolean, address: string) {
    const userDetails: UserState  = {
      loggedIn: logged,
      address,
      balance: 0,
    };
    this.setState({userDetails});
  }
  public render() {
    return (
        <Container>
        <Router>
        <HomeDefault>
            <Row>
             <Col xl={12}>
                <Switch>
                 <Route path="/public" component={PublicRoute} />
                <Route path="/private" component={PrivateRoute} />
                </Switch>
             </Col>
            </Row>
        </HomeDefault>
        </Router>
        </Container>
    );
  }
}
