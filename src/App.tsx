import "./App.css";
import arweave from "./ArweaveInit";
import {AppState, UserState} from "./Types";
import BlogEngine from "./components/BlogEngine";
import Login from "./components/LoginPage";
import LoginButton from "./components/Login";
import LogoutButton from "./components/Logout";
import React from "react";

let mainStyle = {
  width:"100%",
  height:"100%",
  backgroundImage:"linear-gradient(#292929, #191919)",
  backgroundColor:"#191919",
  hotColor:"#F69E4D",
  mainColorAlt:"#fa7d36",
  mainColor:"#F76B1C",
}

export default class App extends Component<{}, AppState> {
  state = {
    userDetails: {
      loggedIn: false,
      address: "",
      balance: 0
    }
  };

  updateDimensions() {
    //force it to rerender when the window is resized to make sure qr fits etc
    this.forceUpdate();
  }

  componentDidMount() {
    document.body.style.backgroundColor = mainStyle.backgroundColor
    window.addEventListener("resize", this.updateDimensions.bind(this));

  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  logout(event: React.MouseEvent<HTMLElement, MouseEvent>): void{
    console.log("logOut")
  }

  loggedin(logged: boolean, address: string){
    let userDetails: UserState  = {
      loggedIn: logged,
      address: address,
      balance: 0
    }
    this.setState({userDetails})
  }
  render() {
    return (
        <Container>
           <Router>
            <AuthArweaveComponent/>
            <div className="App">
            <Row>
             <Col xl={12}>
                <Route path="/" exact component={DefaultComponent} />
                <Route path="/public" component={PublicRoute} />
                <Route path="/public/createWallet" exact component={CreateWalletComponent} />
                <Route path="/private" component={PrivateRoute} />
                <Route path="/private/draft" exact component={BlogEngine} />
             </Col>
            </Row>
           </div>
          </Router>
        </Container>
    )
  }
}
