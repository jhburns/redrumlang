
import astify from "src/astify";

const source = `
de
  2
  ;if
    {1 - n}bif + {2 - n}bif 
  esle
    n
  neht n > 2 fi
od {n}bif fed
`;

console.log(astify(source));