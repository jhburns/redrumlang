import { Ast } from 'src/ast';

redrum
  = additive

additive
  = left:multiplicative "+" right:additive { return { left, tag: 'add', right } }
  / multiplicative

multiplicative
  = left:primary "*" right:multiplicative { return { left, tag: 'mul', right } }
  / primary

primary
  = integer
  / "(" additive:additive ")" { return additive; }

integer "simple number"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }