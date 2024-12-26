import tokenize from "./tokenizer.js";
import parse from "./parser.js";
import render from "./renderer.js";

class MarkdownEngine {
    constructor() {
        this.plugins = [];
    }

    use(plugin) {
        this.plugins.push(plugin);
    }

    parseMarkdown(markdown) {
        let tokens = tokenize(markdown);
        let ast = parse(tokens);

        this.plugins.forEach(plugin => {
            ast = plugin(ast);
        });

        return render(ast);
    }
}

export default MarkdownEngine;