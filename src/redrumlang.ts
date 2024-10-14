// If there is a typing error, generate the parser first
import { parse } from 'lib/parser.js';
import walk from 'src/walk';

console.log(parse(`
def
 12-
od {a}foo fed
`));