import React  from 'react';
import {UserState, LoginProps} from '../../Types';
import styled from 'styled-components';

const DragAndDropFile = styled.input`
    opacity: 0;
    position: absolute;
    background: none;
    width: 100%;
    height: 100%;`;


const EncloseFileElement = styled.div`
    cursor: pointer;
    height: 300px;
    border: 2px dashed #62666f;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: auto;
    max-width: 400px;`;

export default class Login extends React.Component<LoginProps, UserState> {
    state = {
        loggedIn: false,
        address: ""
    };

    async componentDidMount(){
        this.setState({loggedIn: false, address: ""})
      }

    extractAddressFromFile(file: FileList) {
        let fileReader = new FileReader()
        fileReader.onload = async (ev: any) => {
            try {

                if(ev.target){
                    console.log(ev.target.result)
                    let wallet = JSON.parse(ev.target.result)
                    let address = ""
                    console.log(wallet)
                    if(this.props.arweave){
                        address = await this.props.arweave.wallets.jwkToAddress(wallet);
                    }
                    console.log(address)

                    this.props.loggedin(true, address, "main")
                }

            } catch (err) {
            }
        }
        fileReader.readAsText(file[0])
    }
    update(loggedin: boolean, address: string){
        this.setState({loggedIn:loggedin, address:address})
    }

    logout(view: string) {
        if(!this.state.loggedIn){
            return
        }
        this.update(false, "")
        //this.props.changeView(view)

    }

    login(view: string) {


        //this.extractAddressFromFile(files)
        if (!this.state.loggedIn) {
            //this.props.viewChange("failed", this.state)
            return
        }
        //this.props.changeView("loggedin")
    }

    render() {

       /** let topLeft = (
            <div style={{zIndex:-2,position:"absolute",left:16,top:4,cursor:"pointer"}} onClick={() => this.login('login')} >
                <button onClick={()=> this.login("login")} >Login</button>
            </div>
          )
        */

            if(this.state.loggedIn){
                return(<div>
                    logged in
                </div>)

            } else {
                return (
                    <div>
                    <EncloseFileElement>
                    <DragAndDropFile
                            type="file"
                            onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                                if(ev.target.files){this.extractAddressFromFile(ev.target.files)}}}
                    />
                    <label>Drop your login file key here</label>
                    </EncloseFileElement>
                  </div>

                )
            }

    }
}

