import React, { Component } from "react";
import {
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

import { Button, ButtonToolbar, Row, Col } from "react-bootstrap"
import Arweave from "arweave/web";

import HomeDefault from "./HomeDefault"
import SettingsComponent from "./SettingsComponent"
import BlogPageContainer from "./BlogEngine"
import { RedirectState } from "../Types"
import styled from "styled-components";


class ArweaveSingleton {
  private static _instance: ArweaveSingleton;
  private _arweave: Arweave;
  protected constructor() {
    this._arweave = Arweave.init({
      host: 'arweave.net',// Hostname or IP address for a Arweave node
      port: 80,           // Port, defaults to 1984
      protocol: 'https',  // Network protocol http or https, defaults to http
      timeout: 20000,     // Network request timeouts in milliseconds
      logging: false,     // Enable network request logging
    })
  }

  public arweave():Arweave {
    return this._arweave;
  }

  public static getInstance():ArweaveSingleton {
    return ArweaveSingleton._instance || (ArweaveSingleton._instance = new ArweaveSingleton());
  }

}

const arweaveAuth = {
  balance:0,
  address: "",
  isAuthenticated: false,
  arweave: ArweaveSingleton.getInstance().arweave(),
  authenticate(files: FileList | null, cb:Function) {
    if(!files || (files.length === 0))
      console.log('No files supplied');
    else {
      let fileReader = new FileReader()
      fileReader.onload = (ev: any) => {
        if(ev.target){
          const wallet = JSON.parse(ev.target.result)
          console.log(wallet)

          this.arweave.wallets
            .jwkToAddress(wallet)
            .then(address => {
              this.address = address
              this.arweave.wallets.getBalance(address)
                .then((balance) => {
                  let ar = this.arweave.ar.winstonToAr(balance);
                  this.isAuthenticated = true;
                  this.balance = parseInt(ar,10)
                  cb();
                });
            })
        }
      }
      fileReader.readAsText(files[0])
    }
  },
  signout(cb:any) {
    this.isAuthenticated = false;
    cb()
  }
};

const AuthButton = withRouter(
  ({ history
 }) => {
    return !arweaveAuth.isAuthenticated ? (
      <ButtonToolbar>
        <Row>
        <Col xl={6} className="toolbar">
          <Link to="/public/createWallet" type="button" className="btn btn-secondary">
            Create protected wallet
          </Link>
        </Col>
        <Col xl={6} className="toolbar">
          <Login/>
        </Col>
        </Row>
        </ButtonToolbar>
    ) : (
        <ButtonToolbar>
        <Row>
        <Col xl={8} className="toolbar">
        <p>Wallet: {arweaveAuth.address}</p>
        <p>balance: {arweaveAuth.balance} AR</p>
        </Col>
        <Col xl={2} className="toolbar">
          <Link to="/private/draft" type="button" className="btn btn-secondary">
            Draft
          </Link>
          <Button variant="success">Settings</Button>
          <Button variant="secondary" onClick={() => arweaveAuth.signout(() => history.push("/"))}>Logout</Button>
        </Col>
        </Row>
        </ButtonToolbar>
    )
  }
);

export function PublicRoute(params:any){
  return (
      <div>
        <h1>Public</h1>
      </div>
  );
}
export function PrivateRoute(params:any) {
  const {component:Component, ...rest} = params
  return (
    <Route
      {...rest}
      render={props =>
        arweaveAuth.isAuthenticated ? (
            <Component {...props}>
              <Route exact path={props.match.path} component={HomeDefault} />
              <Route path={`${props.match.path}/draft`} component={BlogPageContainer} />
              <Route path={`${props.match.path}/settings`} component={SettingsComponent} />
            </Component>
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

const DragAndDropFile = styled.input`
background: none;
width: 100%;
height: 100%;
text-color: whilte`;

const EncloseFileElement = styled.div`
cursor: pointer;
border: 2px dashed #62666f;
text-align: center;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
position: relative;
margin: auto;
max-width: 400px;`;

class Login extends Component<{}, RedirectState> {
  state = { redirectToReferrer: false }

  login(files:FileList | null, cb:Function){
    arweaveAuth.authenticate(files, () => {
      this.setState({ redirectToReferrer: false });
      cb();
    });
  };

  render() {
    let { from } = /* (this.props as any).location.state || */ { from: { pathname: "/" } };
    let { redirectToReferrer } = this.state;

    if (redirectToReferrer) return <Redirect to={from} />;

    return (
        <div>
         <EncloseFileElement>
          <DragAndDropFile
             type="file"
             onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
               this.login(ev.target.files, () => {
                 console.log('Successfully logged in!')
                 window.history.go(-1)
               })
             }}
          />
          <label>Drop your login file key here</label>
        </EncloseFileElement>
      </div>
    );
  }
}

function AuthArweaveComponent() {
  return (
      <AuthButton/>
  );
}

export { AuthArweaveComponent, ArweaveSingleton };
