// If there is a typing error, generate the parser first
import { parse, SyntaxError as PeggySyntaxError } from 'lib/parser.js';

type UnaOpCode = 'bitNot' /* ton */ | 'neg' /* gen */; // add more
type DosOpCode =
    'leftShift' /* >> */ | 'rightShift' /* << */ |
    'mul' /* * */ | 'div' /* / */ |
    'add' /* + */ | 'sub' /* - */ |
    'eq' /* = */ | 'lessThan' /* > */ | 'greaterThan' /* < */ | 'lessThanEq' /* => */ | 'greaterThanEq' /* =< */ |
    'bitAnd' /* dna */ | 'bitOr' /* ro */ |
    'pipe' /* >| */;

type Ident = { tag: 'ident', name: string }; /* a..z | _ */

type Expr =
    { tag: 'integer', value: string } | /* 012 */
    { tag: 'string', value: string } | /* "elpmaxe" */
    { tag: 'boolean', value: boolean } | /* eurt | eslaf */
    { tag: 'unit' } | /* Я */
    { tag: 'unaOp', opCode: UnaOpCode, expr: Expr, } |
    { tag: 'dosOp', left: Expr, opCode: DosOpCode, right: Expr } |
    { tag: 'apply', args: Expr[], calle: Ident } | /* {c ,b ,a}f */
    Ident |
    { tag: 'if', onFalse: Stats, onTrue: Stats, cond: Expr }; /* if onFalse esle onTrue neht cond fi */;

type Stat =
    { tag: 'expr', expr: Expr } | /* e */
    { tag: 'let', expr: Expr, name: Ident } | /* e <- tel */
    { tag: 'loop', body: Stats } | /* loop s pool */
    { tag: 'break', expr: Expr } /* pots */;

type Stats = Stat[]; /* e1; e0 */

/*
def
  s
od {c, b ,a}elpmaxe fed
*/
export type Ast = {
    name: Ident,
    params: Ident[],
    body: Stats,
};

const astify = (source: string): Ast | string => {
    try {
        return parse(source);
    } catch (err: unknown) {
        if (err instanceof PeggySyntaxError) {
            return `Syntax Error: ${err.message}`;
        }

        throw err;
    }
}

export default astify;