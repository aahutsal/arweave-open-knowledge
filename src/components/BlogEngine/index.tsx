import React from "react";

import {convertToRaw, Editor, EditorState,  RichUtils} from "draft-js";

class BlogPageContainer extends React.Component<{}, {}> {
    editor?: Editor;

    state = {
        editorState: EditorState.createEmpty(),
    };

    setEditor(editor: Editor) {
        if (editor) {
            this.editor = editor;
        }
    }

    focusEditor() {
        if (this.editor) {
          this.editor.focus();
        }
    }

    componentDidMount() {
        this.focusEditor();
    }

    onChange(editorState: EditorState) {
        this.setState({editorState});

    }

    submitEditor() {
        const contentState = this.state.editorState.getCurrentContent();
        const note = {
                      created: Date.now() + "",
                      transformed: JSON.stringify(convertToRaw(contentState)),
                      };
        localStorage.setItem(note.created, note.transformed);
    }

    handleKeyCommand(command: string) {
        const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
        if (newState) {
            this.onChange(newState);
            return "handled";
        }
        return "not-handled";
    }

    onItalicClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC"));
    }

    onBoldClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "BOLD"));
    }

    onUnderlineClick() {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE"));
    }

    render() {
        this.onUnderlineClick = this.onUnderlineClick.bind(this);
        this.onBoldClick = this.onBoldClick.bind(this);
        this.onItalicClick = this.onItalicClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.submitEditor = this.submitEditor.bind(this);
        this.setEditor = this.setEditor.bind(this);
        this.focusEditor = this.focusEditor.bind(this);
        return (
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
        );
    }
}

export default BlogPageContainer;
