import React, { Component } from "react";
import {
  Link,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import Arweave from "arweave/web";
import { Button, ButtonToolbar, Col, Container, Row } from "react-bootstrap";

import styled from "styled-components";
import { RedirectState } from "../Types";
import BlogPageContainer from "./BlogEngine";
import DefaultComponent from "./DefaultComponent";
import SettingsComponent from "./SettingsComponent";

export class ArweaveSingleton {

  public static instance(): ArweaveSingleton {
    return ArweaveSingleton._instance || (ArweaveSingleton._instance = new ArweaveSingleton());
  }
  private static _instance: ArweaveSingleton;
  private _arweave: Arweave;
  protected constructor() {
    this._arweave = Arweave.init({
      host: "arweave.net", // Hostname or IP address for a Arweave node
      port: 80,           // Port, defaults to 1984
      protocol: "https",  // Network protocol http or https, defaults to http
      timeout: 20000,     // Network request timeouts in milliseconds
      logging: false,     // Enable network request logging
    });
  }

  public arweave(): Arweave {
    return this._arweave;
  }

}

export class AuthToolbarClass extends React.Component<{}, {
  balance: number,
  address: string,
  redirect: string | undefined;
}> {
  public static instance(): AuthToolbarClass {
    if (AuthToolbarClass._instance) {
      return AuthToolbarClass._instance;
    } else { throw new Error("Compnent not mounted!!!"); }
  }

  private static _instance: AuthToolbarClass;

  public state = {
    balance: 0,
    address: "",
    redirect: undefined,
  };

  public arweave: Arweave;

  constructor(props?: any) {
    super(props);

    this.arweave = ArweaveSingleton.instance().arweave();
    this.authenticate = this.authenticate.bind(this);
    this.signout = this.signout.bind(this);

    AuthToolbarClass._instance = this;
  }

  public componentDidMount() {
    console.log("Mounted:" + this.constructor.name);
    const wallet = localStorage.getItem("wallet");
    if (wallet) {
      this.arweave.wallets
        .jwkToAddress(JSON.parse(wallet))
        .then(async (address: any) => {
          const ar = await this.arweave.wallets.getBalance(address)
            .then((balance) => {
              return this.arweave.ar.winstonToAr(balance);
            });

          this.setState({
            balance: parseInt(ar, 10),
            address,
          });
        });
    }
  }

  public componentWillUpdate(nextProps: any, nextState: any) {
    console.log("Umounted...");
  }

  public authenticate(files: FileList | null, cb: Function) {
    if (!files || (files.length === 0)) {
      console.log("No files supplied");
    } else {
      const fileReader = new FileReader();
      fileReader.onload = (ev: any) => {
        if (ev.target) {
          const wallet = JSON.parse(ev.target.result);
          console.log(wallet);
          this.arweave.wallets
            .jwkToAddress(wallet)
            .then(async (address) => {
              const ar = await this.arweave.wallets.getBalance(address)
                .then((balance) => {
                  cb();
                  return this.arweave.ar.winstonToAr(balance);
                });

              localStorage.setItem("wallet", JSON.stringify(wallet));
              this.setState({
                balance: parseInt(ar, 10),
                address,
                redirect: "/private/draft",
              });

            });
        }
      };
      fileReader.readAsText(files[0]);
    }
  }

  public signout(cb: any) {
    localStorage.removeItem("wallet");
    cb();
  }

  public render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect to={redirect}/>;
    }
    console.log("Draw toolbar");
    return !AuthToolbarClass.instance().isAuthenticated() ? (
        <ButtonToolbar>
         <Row>
          <Col xs={8} className="toolbar">
            <Link to="/public/createWallet" type="button" className="btn btn-secondary">
            Create protected wallet
            </Link>
          </Col>
          <Col xs={4} className="toolbar">
            <Login/>
          </Col>
         </Row>
        </ButtonToolbar>
    ) : (
        <ButtonToolbar>
        <Container>
        <Row>
        <Col xs={8} className="toolbar">
        <p>Wallet: {this.state.address}</p>
        <p>balance: {this.state.balance} AR</p>
        </Col>
        <Col xs={4} className="toolbar">
        <Link to="/private/draft" type="button" className="btn btn-secondary">Draft</Link>
        <Button variant="success" onClick={() => this.setState({redirect: "/private/settings"})}>Settings</Button>
        <Button variant="secondary" onClick={() => this.signout(() => this.setState({redirect: "/"}))}>Logout</Button>
        </Col>
        </Row>
        </Container>
        </ButtonToolbar>
    );
  }

  public isAuthenticated(): boolean { return localStorage.getItem("wallet") != null; }
}

export function PublicRoute(params: any) {
    return (
        <div>
        <h1>Public</h1>
        <DefaultComponent/>
        </div>
    );
  }

export function PrivateRoute(params: any) {
  const {component: Component, ...rest} = params;
  return (
    <Route
      {...rest}
      render={(props) =>
        AuthToolbarClass.instance().isAuthenticated() ? (
            <div>
              <Switch>
              <Route path={`${props.match.path}/draft`} exact={true} component={BlogPageContainer} />
              <Route path={`${props.match.path}/settings`} exact={true} component={SettingsComponent} />
              </Switch>
            </div>
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
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
  public state = { redirectToReferrer: false };

  public login(files: FileList | null, cb: Function) {
    AuthToolbarClass.instance().authenticate(files, () => {
      cb();
    });
  }

  public render() {
    const { from } = /* (this.props as any).location.state || */ { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    console.log("redirectToReferrer:", redirectToReferrer);
    if (redirectToReferrer) { return <Redirect to={from} />; }

    return (
        <div>
         <EncloseFileElement>
          <DragAndDropFile
             type="file"
             onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
               this.login(ev.target.files, () => {
                 console.log("Successfully logged in!");
               });
             }}
          />
          <label>Drop your login file key here</label>
        </EncloseFileElement>
      </div>
    );
  }
}

export async function getMyAddress():Promise<string | null>{
  const wallet = localStorage.getItem("wallet");
  if(wallet)
    return await ArweaveSingleton.instance().arweave()
                   .wallets.jwkToAddress(JSON.parse(wallet))
  else
    return Promise.resolve(null);
};


export default AuthToolbarClass;
