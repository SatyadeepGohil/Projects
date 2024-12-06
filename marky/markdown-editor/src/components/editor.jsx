import React, { useRef, useState, useEffect, useCallback } from "react";
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const Editor = () => {
  const [input, setInput] = useState(`# Welcome to Markdown Editor 🎉

Explore the amazing features of this **Markdown Editor** with live preview and resizable panels. Below are some examples to get you started:

---

## Features You Can Use

### 1. Text Formatting
- **Bold**: \`**Bold**\`
- *Italic*: \`*Italic*\`
- ***Bold and Italic***: \`***Bold and Italic***\`
- ~~Strikethrough~~: \`~~Strikethrough~~\`

---

### 2. Lists
#### Unordered Lists:
- Item 1
- Item 2
  - Nested Item

#### Ordered Lists:
1. First Item
2. Second Item
   1. Nested Item

---

### 3. Code Snippets
\`\`\`javascript
// Code block
function example() {
  return "Hello, World!";
}
\`\`\`

Inline \`code\` works too: \`console.log("Hello");\`

---

### 4. Links & Images
- [Visit OpenAI](https://www.openai.com)
- ![Sample Image](https://via.placeholder.com/150)

---

### 5. Blockquotes
> "Markdown makes it easy to create beautiful documentation."  
> - Anonymous

---

### 6. Tables
| Feature       | Example           | Syntax        |
|---------------|-------------------|---------------|
| **Headers**   | Bold & Italics    | \`| Header |\`  |
| **Content**   | Rows & Columns    | \`| Data  |\`   |

---

### 7. Task Lists
- [x] Create a Markdown Editor  
- [ ] Add more features  
- [ ] Share with others  

---

### 8. Horizontal Rules
Use \`---\` to add a divider.

---

Feel free to edit, explore, and unleash your creativity! 🚀
`);



    const previewRef = useRef(null);
    const editorRef = useRef(null);
    const dividerRef = useRef(null);
    const [editorHeight, setEditorHeight] = useState('300px');
    const [panelWidth, setPanelWidth] = useState('50%');
    const [isDragging, setIsDragging] = useState(false);

    const extensions = {
        blockMath: {
            name: 'blockMath',
            level: 'block',
            start(src) {
                return src.match(/^```\s*math/)?.index;
            },
            tokenizer(src) {
                const rule = /^```\s*math\n([\s\S]*?)```/;
                const match = rule.exec(src);
                if (match) {
                    return {
                        type: 'blockMath',
                        raw: match[0],
                        text: match[1].trim()
                    };
                }
            },
            renderer(token) {
                try {
                    return katex.renderToString(token.text, {
                        throwOnError: false,
                        displayMode: true
                    }); 
                }
                catch (err) {
                    console.error('Block math rendering error:', err);
                    return `<pre><code>${token.text}</code></pre>`;
                }
            }
        },

        inlineMath: {
            name: 'inlineMath',
            level: 'inline',
            start(src) {
                return src.match(/\$/)?.index;
            },
            tokenizer(src) {
                const rule = /^\$([^\$\n]+?)\$/;
                const match = rule.exec(src);
                if (match) {
                    return {
                        type: 'inlineMath',
                        raw: match[0],
                        text: match[1]
                    };
                }
            },
            renderer(token) {
                try {
                    return katex.renderToString(token.text, {
                        throwOnError: false,
                        displayMode: false
                    });
                }
                catch (err) {
                    console.error('Inline math rendering error:', err);
                    return `<code>$${token.text}$</code>`;
                }
            }
        }
    };

    marked.use({
        extensions: [
            extensions.blockMath,
            extensions.inlineMath
        ],
        walkTokens(token) {
            if (token.type === 'code' && token.lang === 'math') {
                token.type = 'blockMath';
            }
        }
    });


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
        <main className="markdown-editor">
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
            aria-label="Resize-panel"
            ></div>

            <div id="preview-panel" 
            ref={previewRef} 
            style={{width: `calc(100% - ${panelWidth} - 5px)`}} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked(input))}}>
            </div>
        </main>
        </>
    )
}

export default Editor;