// If there is a typing error, generate the parser first
import { parse } from 'lib/parser.js';
import walk from 'src/walk';

console.log(walk(parse('2*(3+4)')));