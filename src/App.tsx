import React from "react";
import "./App.css";
import logo from "./logo.svg";
import Login from './components/LoginPage'
import arweave from './ArweaveInit'
import Arweave from 'arweave/web';
import {UserState, AppState} from './Types';
import LoginButton from './components/Login'
import LogoutButton from './components/Logout'

let mainStyle = {
  width:"100%",
  height:"100%",
  backgroundImage:"linear-gradient(#292929, #191919)",
  backgroundColor:"#191919",
  hotColor:"#F69E4D",
  mainColorAlt:"#fa7d36",
  mainColor:"#F76B1C",
}


export default class App extends React.Component<{}, AppState> {

  state = {
    view: "main",
    userDetails: {
      loggedIn: false,
      address: ""
    },
    arweave: undefined
  };

  updateDimensions() {
    //force it to rerender when the window is resized to make sure qr fits etc
    this.forceUpdate();
  }

  componentDidMount() {
    document.body.style.backgroundColor = mainStyle.backgroundColor
    window.addEventListener("resize", this.updateDimensions.bind(this));

    this.connectToArweave()
  }

  connectToArweave(){
    let mainnetArweave: Arweave = arweave();
    this.setState({arweave:mainnetArweave})

  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateView(event: React.MouseEvent<HTMLElement, MouseEvent>): void{
    this.setState({view: (event.target as any).value});
  }

  logout(event: React.MouseEvent<HTMLElement, MouseEvent>): void{
    console.log("logOut")
    let userUpdate: UserState  = {
      loggedIn: false,
       address: ""
    }

    this.setState({view: "main", userDetails: userUpdate, arweave: undefined});
  }

  loggedin(logged: boolean, address: string,  view: string){
    let userDetails: UserState  = {
      loggedIn: false,
       address: ""
    }
    this.setState({userDetails, view})
  }
    render() {
      if(this.state.view.length === 0){
          this.setState({view:"main"})
      }
      const showView =  () => {
          switch(this.state.view) {
              case "main":
                  return(
                      <div>
                        <div className="main-card card w-100" style={{zIndex:1}}>
                          <span className={this.state.userDetails.loggedIn?'hidden':''}>
                            <LoginButton changeView={this.updateView.bind(this)}/>
                          </span>
                          <span className={this.state.userDetails.loggedIn?'':'hidden'}>
                            <LogoutButton logout={this.logout.bind(this)}/>
                          </span>
                        </div>
                      </div>
                  );
              case "Login":
                  return(
                      <Login
                      changeView={this.updateView.bind(this)}
                      loggedin={this.loggedin.bind(this)}
                      arweave={this.state.arweave}/>
                  );
          }
      };

    return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
       </a>
      ${showView()}
      </header>
    </div>
    )
  }
}
