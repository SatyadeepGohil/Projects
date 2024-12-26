import tokenize from "../tokenizer.js";

const markdown = `
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
This is a program.`;

const tokens = tokenize(markdown);
console.log(tokens)