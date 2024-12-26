function tokenize(markdown) {
    return markdown.split(/\n/).map(line => {
        if (line.startsWith('#')) {
            const level = line.match(/^#+/)[0].length;
            return {type: 'heading', level, content: line.slice(level).trim() };
        }
        return { type: 'paragraph', content: line };
    });
}

export default tokenize;