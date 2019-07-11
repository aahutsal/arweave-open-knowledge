import {ContentState , convertFromRaw, EditorState} from "draft-js";
import React from "react";
import { Col, Container,  Row} from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";

const fakeAddress = "0x9003847536278188";

class ReadBlog extends React.Component<RouteComponentProps<{}>> {
    public state = {
        editorState: EditorState.createEmpty(),
    };

    public article?: ContentState;

    constructor(props: any) {
      super(props);
      this.onSubmit = this.onSubmit.bind(this);
    }

    public retrieveArticle(created: string): ContentState | null {
        const container = localStorage.getItem(fakeAddress);
        if (container) {
            const parsedContainer = JSON.parse(container);
            for (const item of parsedContainer) {
                if (item.created === created) {
                    return convertFromRaw(item.transformed);
                }
            }
        }
        return null;
    }

    public componentDidMount() {
        const name = this.props.location.key;
        const url = this.props.match.url;
        console.log(name);
        console.log(url);
        console.log(this.props);
        const timeStamp = url.split("/")[1];
        const article = this.retrieveArticle(timeStamp);
        if (article) {
          this.article = article;
          this.setState({editorState: EditorState.createWithContent(article)});
        }
    }

    public onSubmit() {
        this.props.history.push("/");
    }

    public render() {
      console.log(this.state.editorState.getCurrentContent().hasText());
      if (this.state.editorState.getCurrentContent().hasText() === false) {
            return (
                <Container>
                     <div className="App">
                        <Row>
                            <Col xl={12}>
                                <div className="input-group">
                                <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon">
                                <i className="fas fa-pencil-alt prefix" />
                                </span>
                                </div>
                                <textarea
                                    className="form-control"
                                    rows={50}
                                    defaultValue={this.state.editorState.getCurrentContent.toString()}>                                    
                                </textarea>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <button onSubmit={this.onSubmit}>Close</button>
                        </Row>
                    </div>
                </Container>
            );
        } else {
            return (
                <div>
                    <h2>Not found</h2>
                </div>
            );
        }
    }
}

export default ReadBlog;
