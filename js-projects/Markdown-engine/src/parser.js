function parse(tokens) {

    function applyFormats(content, formats) {
        if (!formats || formats.length === 0) return content;

        const sortedFormats = [...formats].sort((a,b) => b.start - a.start);

        let result = content;
        for (const format of sortedFormats) {
            const before = result.slice(0, format.start);
            const after = result.slice(format.end);
            const formattedContent = format.type === 'bold' ? `<strong>${format.content}</strong>` : `<em>${format.content}</em>`;
            result = before + formattedContent + after;
        }
        return result;
    }
    // Helper function to handle nested lists
    function createListStructure(tokens, startIndex, parentIndent = 0) {
        const items = [];
        let currentItem = null;

        for (let i = startIndex; i < tokens.length; i++) {
            const token = tokens[i];

            // End this list level if we find a token with less indentation
            if (token.indent < parentIndent) {
                break;
            }

            // Process list items at the current indentation level
            if (token.type.includes('list-item') && token.indent === parentIndent) {
                // Save the previous item if it exists
                if (currentItem) {
                    items.push(currentItem);
                }

                // Create new list item
                currentItem = {
                    type: token.type,
                    content: applyFormats(token.content, token.formats),
                    children: []
                };

                // Recursively process nested items
                const nestedTokens = createListStructure(tokens, i + 1, token.indent + 1);
                if (nestedTokens.length > 0) {
                    currentItem.children = nestedTokens;
                }
            }
        }

        // Don't forget to add the last item
        if (currentItem) {
            items.push(currentItem);
        }
        return items;
    }

    const ast = [];
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        // Handle different token types
        if (token.type.includes('list-item')) {
            // Only process root-level list items here
            if (token.indent === 0) {
                const listStructure = createListStructure(tokens, i);
                ast.push({
                    type: token.type.includes('unordered') ? 'unordered-list' : 'ordered-list',
                    items: listStructure
                });

                // Skip the tokens we've already processed
                while (i < tokens.length && tokens[i].type.includes('list-item')) {
                    i++;
                }
                i--;
            }
        } else if (token.type === 'heading') {
            ast.push({
                type: 'heading',
                level: token.level,
                content: applyFormats(token.content, token.formats)
            });
        } else if (token.type === 'bold-text') {
            ast.push({
                type: 'bold-text',
                content: token.content
            });
        } else if (token.type === 'italic-text') {
            ast.push({
                type: 'italic-text',
                content: token.content
            });
        } else if (token.type === 'paragraph') {
            ast.push({
                type: 'paragraph',
                content: applyFormats(token.content, token.formats)
            });
        } else {
            ast.push({
                type: 'unknown',
                content: token.content
            });
        }
    }

    return ast;
}

export default parse;