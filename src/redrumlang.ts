// If there is a typing error, generate the parser first
import { parse } from 'lib/parser.js';
import walk from 'src/walk';

console.log(parse(`
def
 ;2
 if
   {n - 1}bif + {n - 2}bif 
 esle
   n
 neht n > 2 fi
od {n}bif fed
`));