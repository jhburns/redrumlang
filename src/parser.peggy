redrum
  = pipe

integer "simple number"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); } // TODO: Use long and allow negatives

_ "whitespace"
  = [ \t\n\r]*

primary
  = integer
  / "(" _ expr:pipe _ ")" { return expr; }
  / op:("ton" / "gen") _ left:shift { 
      return { 
        tag: 'unaOp',
        opCode: op === 'ton' ? 'not' : 'gen',
        expr: left
      } 
    }

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
  

