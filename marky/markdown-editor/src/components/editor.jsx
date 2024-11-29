import React from "react";

const Editor = () => {

    return (
        <>
        <pre contentEditable="true" id="editor-panel">
            heading 1
        </pre>
        <div id="preview-panel"></div>
        </>
    )
}

export default Editor;