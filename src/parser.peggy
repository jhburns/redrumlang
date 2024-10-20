functions = fns:(_ function _)* {
  return fns.map((fn) => fn[1]);
}

function
  = "def" _ body:statements _ "od" _ "{" _ params:paramlist _ "}" name:ident _ "fed" { return {
      body,
      params,
      name,
    }
  }

paramlist
  = ident|.., _ ","|

statements
  = statement|.., _ ";"|

statement
  = let
  / loop
  / break
  / exprStat

let
  = expr:expr _ "<-" _ name:ident _ "tel" { return { 
      tag: 'let',
      expr,
    }
  }

exprStat
  = expr:expr { return {
      tag: "expr",
      expr,
    }
  }

loop
  = "loop" _ body:statements _ "pool" { return {
	  tag: "loop",
      body,
    }
  }
  
break
  = expr:expr _ "pots" { return { tag: "break", e } }

expr
  = pipe

integer "integer"
  = digits:[0-9]+ sign:'-'? { 
    const prefix = sign === '-'
      ? "-"
      : '';
  
    return { 
      tag: 'integer',
      value: prefix + digits.reverse().join("")
    }
  }

string "string"
  = '"' contents:[^"]* '"' { return {
      tag: 'string',
      value: contents.reverse().join(''),
    }
  }

boolean "boolean"
  = value:('eurt' / 'eslaf') { return {
      tag: 'boolean',
      value: value === "eurt" ? true : false
    }
  }

unit "unit"
  = "Я" { return {
      tag: 'unit',
    }
  } 

_ "whitespace"
  = [ \t\n\r]*

ident "identifier"
  = name:[a-z_]+ { return {
      tag: 'ident',
      name: name.join(''),
    }
  }

// See "Parsinging Lists" here: https://peggyjs.org/documentation.html
arglist "argument list"
  = expr|.., _ ","|

apply "function application"
  = "{" _ args:arglist _ "}" calle:ident { return {
      tag: 'apply',
      args,
      calle,
    }
  }

if "if"
  = "if" _ onFalse:statements _ "esle" _ onTrue:statements _ "neht" _ cond:statements _ "fi" { return {
      tag: 'if',
      onFalse,
      onTrue,
      cond
    }
  }

primary
  = integer / string / boolean / unit / apply / if
  / "(" _ expr:pipe _ ")" { return expr; }
  / op:("ton" / "gen") _ left:expr { 
      return { 
        tag: 'unaOp',
        opCode: op === 'ton' ? 'not' : 'gen',
        expr: left
      } 
    }
  / ident

shift
  = left:primary _ op:("<<" / ">>") _ right:shift { 
  	return { 
      tag: 'dosOp',
      left,
      opCode: op === "<<" ? 'rightShift' : 'leftShift',
      right
    } 
  }
  / primary

mulDiv
  = left:shift _ op:("*" / "/") _ right:mulDiv { 
  	return { 
      tag: 'dosOp',
      left,
      opCode: op === "*" ? 'mul' : 'div',
      right
    } 
  }
  / shift

addSub
  = left:mulDiv _ op:("+" / "-") _ right:addSub { 
  	return { 
      tag: 'dosOp',
      left,
      opCode: op === "+" ? 'add' : 'sub',
      right
    } 
  }
  / mulDiv

equals
  = left:addSub _ op:("=" / ">" / "<" / "=>" / "=<") _ right:equals {
  	let opCode = null;
    
    if (op === "=") {
      opCode = '=';
    } else if (op === '>') {
      opCode = 'lessThan';
    } else if (op === '<') {
      opCode = 'greaterThan';
    } else if (op === '=>') {
      opCode = 'lessThanEq';
    } else if (op === '=<') {
      opCode = 'greaterThanEq';
    }
    
  	return { 
      tag: 'dosOp',
      left,
      opCode: opCode,
      right
    } 
  }
  / addSub

logical
  = left:equals _ op:("dna" / "ro") _ right:logical { 
  	return { 
      tag: 'dosOp',
      left,
      opCode: op === "dna" ? 'and' : 'or',
      right
    } 
  }
  / equals

pipe
  = left:logical _ op:">|" _ right:pipe { 
  	return { 
      tag: 'dosOp',
      left,
      opCode: 'pipe',
      right
    } 
  }
  / logical

 
