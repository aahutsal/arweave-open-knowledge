import React from 'react';
import PropTypes from 'prop-types';

import { Button, Row, Col} from 'react-bootstrap';
import { ArweaveSingleton } from './AuthArweaveComponent'
const propTypes = {};
const defaultProps = {};

class TextareaComponent extends React.Component<{className?:string, rows:number, readOnly?:boolean, value?:string}, {}>{
  static propTypes:any = {
  };
  static defaultProps:any = {
    className:"",
    readOnly:true
  };
  constructor (props:any){
    super(props)
  }

  render(){
    return (
        <div className="input-group">
        <div className="input-group-prepend">
        <span className="input-group-text" id="basic-addon">
        <i className="fas fa-pencil-alt prefix"></i>
        </span>
        </div>
        <textarea {...this.props} className="form-control {...this.props.className}" rows={this.props.rows || 12}>{this.props.value}</textarea>
        </div>
    )
  }
}
class CreateWalletComponent extends React.Component<{}, {address:string, key:string}> {
  static propTypes:any = {};
  static defaultProps:any = {};
  state = {
    address:"",
    key:""
  }
  constructor(props:any) {
    super(props);
  }

  generateNewAddress(){
    const arweave = ArweaveSingleton.getInstance().arweave();
    arweave.wallets.generate()
      .then((jwkObject) => {
        arweave.wallets.jwkToAddress(jwkObject)
          .then((address) => {
            const key =  JSON.stringify(jwkObject, null, 2)
            console.log(address);
            this.setState({address, key})
            this.saveTextAsFile(key, `arweave-keyfile-${address}.json`)
          })
    });
  }
  saveTextAsFile(textToWrite:any, fileName:string){
    var textFileAsBlob = new Blob([textToWrite
                                  ], {type:'text/json'});
    var downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.innerHTML = "Download File";
    if ((window as any).webkitURL != null)
    {
    	// Chrome allows the link to be clicked
    	// without actually adding it to the DOM.
    	downloadLink.href = (window as any).webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
    	// Firefox requires the link to be added to the DOM
    	// before it can be clicked.
    	downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
//    	downloadLink.onclick = destroyClickedElement;
    	downloadLink.style.display = "none";
    	document.body.appendChild(downloadLink);
    }

    downloadLink.click();
  }
  render() {
    return (
      <div>
        <Row>
        <Col xs={12}>
        <TextareaComponent readOnly={true} rows={12} value={this.state.key}></TextareaComponent>
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
};

CreateWalletComponent.propTypes = propTypes;
CreateWalletComponent.defaultProps = defaultProps;

export default CreateWalletComponent;
