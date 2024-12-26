function render(ast) {
    return ast.map(node => {
        if (node.type === 'heading') {
            return `<h${node.level}>${node.content}</h${node.level}>`;
        }
        if (node.type === 'paragraph') {
            return `<p>${node.content}</p>`;
        }
    }).join("\n");
}

export default render;