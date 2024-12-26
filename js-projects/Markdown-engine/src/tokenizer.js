function tokenize(markdown) {
    let currentListLevel = 0;

    return markdown.split(/\n/).map(line => {
        const indentMatch = line.match(/^(\s*)/);
        const indentLevel = indentMatch ? Math.floor(indentMatch[0].length / 2) : 0;
        const trimmedLine = line.trim();

        function processInlineFormatting(text) {
            const formats = [];
            const boldRegex = /\*\*(.*?)\*\*/g;
            let boldMatch;
            while ((boldMatch = boldRegex.exec(text)) !== null) {
                formats.push({
                    start: boldMatch.index,
                    end: boldMatch.index + boldMatch[0].length,
                    type: 'bold',
                    content: boldMatch[1]
                });
            }

            const italicRegex = /\*(.*?)\*/g;
            let italicMatch;
            while ((italicMatch = italicRegex.exec(text)) !== null) {
                const isBold = formats.some(f => 
                    italicMatch.index >= f.start && italicMatch.index <= f.end);
                if (!isBold) {
                    formats.push({
                        start: italicMatch.index,
                        end: italicMatch.index + italicMatch[0].length,
                        type: 'italic',
                        content: italicMatch[1]
                    });
                }
            }
            return formats;
        }

        if (trimmedLine.startsWith('#')) {
            const level = line.match(/^#+/)[0].length;
            const content = trimmedLine.slice(level).trim();
            const formats = processInlineFormatting(content);
            return {
                type: 'heading',
                level,
                content,
                formats,
                indent: indentLevel
            }
        }

        if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            const content = trimmedLine.slice(1).trim();
            const formats = processInlineFormatting(content);
            return {
                type: 'unordered-list-item',
                content,
                formats,
                indent: indentLevel
            };
        }

        const orderedListMatch = trimmedLine.match(/^\d+\./);
        if (orderedListMatch) {
            const content = trimmedLine.slice(orderedListMatch[0].length).trim();
            const formats = processInlineFormatting(content);
            return {
                type: 'ordered-list-item',
                content,
                formats,
                indent: indentLevel
            };
        }

        const formats = processInlineFormatting(trimmedLine);
        return {
            type: 'paragraph',
            content: trimmedLine,
            formats,
            indent: indentLevel
        };
    }).filter(token => token.content.trim() !== '');
}

export default tokenize;