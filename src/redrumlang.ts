// If there is a typing error, generate the parser first
import { parse } from '../lib/parser.js'

console.log(parse('2*(3+4)'));