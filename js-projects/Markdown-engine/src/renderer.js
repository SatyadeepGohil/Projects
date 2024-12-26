function render(ast) {
   function renderList(items, isOrdered = false) {
    const listTag = isOrdered ? 'ol' : 'ul';
    let html = `<${listTag}>`;

    items.forEach(item => {
        html += '<li>';
        html += item.content;
        if (item.children && item.children.length > 0) {
            html += renderList(item.children, item.type.includes('ordered'));
        }
        html += '</li>';
    });

    html += `</${listTag}>`;
    return html;
   }

   const result = [];
   
   ast.forEach(node => {
     if (node.type === 'heading') {
            result.push(`<h${node.level}>${node.content}</h${node.level}>`);
        } else if (node.type === 'paragraph') {
            result.push(`<p>${node.content}</p>`);
        } else if (node.type === 'unordered-list' || node.type === 'ordered-list') {
            result.push(renderList(node.items, node.type === 'ordered-list'));
        }
   })

   return result.join('\n');
}

export default render;