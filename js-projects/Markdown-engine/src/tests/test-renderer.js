import tokenize from "../tokenizer.js";
import parse from "../parser.js";
import render from "../renderer.js";

const markdown = `
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
This is a program.`;

const tokens = tokenize(markdown);
const parser = parse(tokens);
const renderer = render(parser);

console.log(renderer);