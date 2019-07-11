import App from "../../App";
import {ContentState ,convertFromRaw ,convertToRaw, Editor, EditorState,  RichUtils} from "draft-js";
import React from "react";
import { Col, Container,  Row} from "react-bootstrap";
import { BrowserRouter as Router,  Link , Route } from "react-router-dom";
import ReadBlog from "./readBlog";

const fakeAddress = "0x9003847536278188";

class BlogPageContainer extends React.Component<{}, {}> {
    public editor?: Editor;

    public state = {
        editorState: EditorState.createEmpty(),
    };

    public constructor(props: any) {
        super(props);

        this.onUnderlineClick = this.onUnderlineClick.bind(this);
        this.onBoldClick = this.onBoldClick.bind(this);
        this.onItalicClick = this.onItalicClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.submitEditor = this.submitEditor.bind(this);
        this.setEditor = this.setEditor.bind(this);
        this.focusEditor = this.focusEditor.bind(this);

    }

    public setEditor(editor: Editor) {
        if (editor) {
            this.editor = editor;
        }
    }

    public focusEditor() {
        if (this.editor) {
          this.editor.focus();
        }
    }

    public componentDidMount() {
        this.focusEditor();
    }

    public onChange(editorState: EditorState) {
        this.setState({editorState});

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

    public submitEditor() {
        const contentState = this.state.editorState.getCurrentContent();
        const end = 50;
        const tagHeading = contentState.getPlainText().trim().substr(0, end);
        if (contentState.hasText()) {
            const note = {
                created: Date.now() + "",
                heading: tagHeading,
                transformed: convertToRaw(contentState),
                };
            console.log(contentState);
            console.log(contentState.getPlainText());
            const arrayOfTimeStamps = localStorage.getItem(fakeAddress);
            if (arrayOfTimeStamps) {
                const container = JSON.parse(arrayOfTimeStamps);
                container.push([note.created, note]);
                localStorage.setItem(fakeAddress, JSON.stringify(container));
            } else {
                const arrayOfTimeStampAndContent = [note.created, note];
                localStorage.setItem(fakeAddress, JSON.stringify(arrayOfTimeStampAndContent));
            }
        }
    }

    public retrieveArticlesMetaData(): Array<Array<string | string>> {
        const container = localStorage.getItem(fakeAddress);
        const end = 50;
        const compare = (a: any , b: any) => {
            const keyA = parseInt(a.created, 10);
            const keyB = parseInt(b.created, 10);
            // Compare the 2 dates
            if (keyA > keyB) {return -1; }
            if (keyA < keyB) {return 1; }
            return 0;
        };
        const listOfTimeAndHeading: Array<Array<string | string>> = [];
        if (container) {
            const parsedContainer = JSON.parse(container);
            parsedContainer.sort(compare);
            parsedContainer.forEach((element: any) => {
                listOfTimeAndHeading.push([element.created, element.heading]);
            });
        }
        return listOfTimeAndHeading;
    }

    public handleKeyCommand(command: string) {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
        if (newState) {
            this.onChange(newState);
            return "handled";
        }
        return "not-handled";
    }

    public onItalicClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC"));
    }

    public onBoldClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
    }

    public onUnderlineClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE"));
    }

    public render() {
        const links = [];
        const mlistOfContents = this.retrieveArticlesMetaData();
        for (const [created, heading] of mlistOfContents) {
            const link = `/${fakeAddress}/${created}`;
            links.push(<li><Link to={link}>{heading}</Link></li>);
        }

        return (
            <Container>
                 <div className="App">
                    <Row>
                        <Col xl={12}>
                            <div className="editorContainer">
                                <div className="editors" onClick={this.focusEditor}>
                                <button onClick={this.onUnderlineClick}>U</button>
                                <button onClick={this.onBoldClick}><b>B</b></button>
                                <button onClick={this.onItalicClick}><em>I</em></button>
                                <button onClick={this.submitEditor}><em>Save</em></button>
                                <Editor
                                    ref={this.setEditor}
                                    onChange={this.onChange}
                                    handleKeyCommand={this.handleKeyCommand}
                                    editorState={this.state.editorState}
                                />
                                </div>
                                </div>
                        </Col>
                    </Row>
                    <Router >
                        <Row>
                            <Col xl={12}>
                            <div>
                                <h2>Blogss</h2>
                                <strong>Click on the links to read about blog</strong>
                                <ul>
                                <li>
                                    <Link to="/">Home</Link>
                                    </li>
                                    {links}
                                </ul>
                                <Route exact={true} path="/" component={App} />
                                <Route path="/users/:id" component={ReadBlog} />
                            </div>
                            </Col>
                        </Row>
                    </Router>
                 </div>
            </Container>

        );
    }
}

export default BlogPageContainer;
