import {ContentState , convertFromRaw, Editor, EditorState} from "draft-js";
import React from "react";
import { Col, Container,  Row} from "react-bootstrap";
import { withRouter, WithRouterProps } from "react-router";
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
        let name = this.props.location.key;
        let url = this.props.match.url;
        console.log(name);
        console.log(url);
        console.log(this.props);
        let timeStamp = url.split("/")[1];
        const article = this.retrieveArticle(timeStamp);
        if (article) {
            this.article = article;
            this.state.editorState = EditorState.createWithContent(article);
        }

    }

    public onSubmit() {
        this.props.history.push("/");
    }

    public render() {
        if (this.state.editorState.isEmpty()) {
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
                                >
                                    {this.state.editorState.getCurrentContent.toString()}
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
