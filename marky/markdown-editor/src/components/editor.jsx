import React, { useRef, useState, useEffect, useCallback } from "react";
import { marked } from 'marked';

const Editor = () => {
    const [input, setInput] = useState('# Welcome to Markdown Editor');
    const previewRef = useRef(null);
    const editorRef = useRef(null);
    const dividerRef = useRef(null);
    const [editorHeight, setEditorHeight] = useState('300px');
    const [panelWidth, setPanelWidth] = useState('50%');
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = useCallback((e) => {
        if (isDragging) {
            const containerWidth = window.innerWidth;
            const mouseX = e.clientX;

            const minWidth = 100; // Minimum panel width in pixels
            const maxWidth = containerWidth - minWidth;
            const safeMouseX = Math.max(minWidth, Math.min(mouseX, maxWidth));

            const newWidthPercentage = (safeMouseX / containerWidth) * 100;
            setPanelWidth(`${newWidthPercentage}%`);
        }
    },[isDragging]);

    const stopDrag = useCallback(() => {
        setIsDragging(false);
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', stopDrag);
    }, [handleDrag]);

    const startDrag = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);

        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('mouseup', stopDrag);
    }, [handleDrag, stopDrag]);

    const updateHeight = useCallback(() => {
        if (previewRef.current) {
            const newHeight = Math.max(previewRef.current.offsetHeight, 300);
            setEditorHeight(`${newHeight}px`);
        }
    },[])

    useEffect(() => {
        marked.setOptions({
            gfm: true,
            breaks: true,
            smartLists: true,
            smartypants: true,
        });
    },[]);

    useEffect(() => {
        updateHeight();
    }, [input, updateHeight]);

    useEffect(() => {
        return () => {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', stopDrag);
        }
    }, [handleDrag, stopDrag]);

    return (
        <>
        <main>
            <textarea 
            id="editor-panel" 
            value={input} 
            ref={editorRef}
            onChange={(e) => setInput(e.target.value)} 
            style={{width: panelWidth, height: editorHeight}}>
            </textarea>

            <div
            id="divider"
            ref={dividerRef}
            onMouseDown={startDrag}
            style={{cursor: isDragging ? 'col-resize' : 'default', width: '5px', background: '#666', userSelect: 'none'}}
            ></div>

            <div id="preview-panel" 
            ref={previewRef} 
            style={{width: `calc(100% - ${panelWidth} - 5px)`}} dangerouslySetInnerHTML={{__html: marked(input)}}>
            </div>
        </main>
        </>
    )
}

export default Editor;