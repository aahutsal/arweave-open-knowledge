import React from "react";

import { Button, Col, Row} from "react-bootstrap";
import { ArweaveSingleton } from "./ArweaveAuth";
const propTypes = {};
const defaultProps = {};

class TextareaComponent extends React.Component<{className?: string, rows: number, readOnly?: boolean, value?: string}, {}> {
  public static propTypes: any = {};
  public static defaultProps: any = {
    className: "",
    readOnly: true,
  };

  public render() {
    return (
        <div className="input-group">
        <div className="input-group-prepend">
        <span className="input-group-text" id="basic-addon">
        <i className="fas fa-pencil-alt prefix"/>
        </span>
        </div>
        <textarea {...this.props} className="form-control {...this.props.className}" rows={this.props.rows || 12}>{this.props.value}</textarea>
        </div>
    );
  }
}
class CreateWalletComponent extends React.Component<{}, {address: string, key: string}> {
  public static propTypes: any = {};
  public static defaultProps: any = {};
  public state = {
    address: "",
    key: "",
  };

  public generateNewAddress() {
    const arweave = ArweaveSingleton.instance().arweave();
    arweave.wallets.generate()
      .then((jwkObject) => {
        arweave.wallets.jwkToAddress(jwkObject)
          .then((address) => {
            const key =  JSON.stringify(jwkObject, null, 2);
            console.log(address);
            this.setState({address, key});
            this.saveTextAsFile(key, `arweave-keyfile-${address}.json`);
          });
    });
  }
  public saveTextAsFile(textToWrite: any, fileName: string) {
    let textFileAsBlob = new Blob([textToWrite,
                                  ], {type: "text/json"});
    let downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.innerHTML = "Download File";
    if ((window as any).webkitURL != null) {
    	// Chrome allows the link to be clicked
    	// without actually adding it to the DOM.
    	downloadLink.href = (window as any).webkitURL.createObjectURL(textFileAsBlob);
    } else {
    	// Firefox requires the link to be added to the DOM
    	// before it can be clicked.
    	downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
//    	downloadLink.onclick = destroyClickedElement;
    	downloadLink.style.display = "none";
    	document.body.appendChild(downloadLink);
    }

    downloadLink.click();
  }
  public render() {
    return (
      <div>
        <Row>
        <Col xs={12}>
        <TextareaComponent readOnly={true} rows={12} value={this.state.key}/>
        </Col>
        </Row>
        <Row>
        <Col xs={12}>
        <Button className="float-right" onClick={this.generateNewAddress.bind(this)}>Generate</Button>
        </Col>
        </Row>
      </div>
    );
  }
}

CreateWalletComponent.propTypes = propTypes;
CreateWalletComponent.defaultProps = defaultProps;

export default CreateWalletComponent;
