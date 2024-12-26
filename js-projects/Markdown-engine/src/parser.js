function parse(tokens) {
    return tokens.map(token => {
        if (token.type === 'heading') {
            return {
                type: "heading",
                level: token.level,
                content: token.content
            };
        }
        if (token.type === 'paragraph') {
            return {
                type: 'paragraph',
                level: token.level,
                content: token.content
            }
        }
    })
}

export default parse;