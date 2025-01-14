import { Map } from 'immutable';
import Long from 'long';

import type { Ast, Ident, Stat, Stats, Expr, UnaOpCode, DosOpCode } from '~/src/astify';
import { ScreamError, maercs, expectType, expectComparable, compare, exposed } from '~/src/builtIn';

interface Signature {
    params: Ident[],
    body: Stats,
}

type Fns = Map<string, Signature>;

const collectFns = (ast: Ast): Fns => {
    const sigs: [string, Signature][] = ast.map((fn) => [fn.name.name, {
        params: fn.params,
        body: fn.body
    }]);

    return Map(sigs);
}

export type Cell = { tag: 'cell', value: Value };
export type Value = Long | string | boolean | null | Cell;

export interface Global {
    readonly fns: Fns,
    vars: Map<string, Value>,
    readonly outBuffer: string[],
}

class ExecutionError extends Error {
    constructor(message: string) {
        super(message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, ExecutionError.prototype);
    }
}

const walkUna = (g: Global, opCode: UnaOpCode, expr: Expr): Value => {
    const value = walkExpr(g, expr);
    switch (opCode) {
        case 'bitNot': {
            expectType(g, value, 'boolean');
            return !(value as boolean);
        }
        case 'neg': {
            expectType(g, value, 'integer');
            return (value as Long).negate();
        }
    }
}

const walkDos = (g: Global, left: Expr, opCode: DosOpCode, right: Expr): Value => {
    switch (opCode) {
        case 'leftShift': {
            const rightValue = walkExpr(g, right);
            expectType(g, rightValue, 'integer');
            const leftValue = walkExpr(g, left);
            expectType(g, leftValue, 'integer');
            return (rightValue as Long).shiftLeft(leftValue as Long);
        }
        case 'rightShift': {
            const rightValue = walkExpr(g, right);
            expectType(g, rightValue, 'integer');
            const leftValue = walkExpr(g, left);
            expectType(g, leftValue, 'integer');
            return (rightValue as Long).shiftRight(leftValue as Long);
        }
        case 'mul': {
            const rightValue = walkExpr(g, right);
            expectType(g, rightValue, 'integer');
            const leftValue = walkExpr(g, left);
            expectType(g, leftValue, 'integer');
            return (rightValue as Long).mul(leftValue as Long);
        }
        case 'div': {
            const rightValue = walkExpr(g, right);
            expectType(g, rightValue, 'integer');
            const leftValue = walkExpr(g, left);
            expectType(g, leftValue, 'integer');
            return (rightValue as Long).div(leftValue as Long);
        }
        case 'add': {
            const rightValue = walkExpr(g, right);
            expectType(g, rightValue, 'integer');
            const leftValue = walkExpr(g, left);
            expectType(g, leftValue, 'integer');
            return (rightValue as Long).add(leftValue as Long);
        }
        case 'sub': {
            const rightValue = walkExpr(g, right);
            expectType(g, rightValue, 'integer');
            const leftValue = walkExpr(g, left);
            expectType(g, leftValue, 'integer');
            return (rightValue as Long).sub(leftValue as Long);
        }
        case 'eq': {
            const rightValue = walkExpr(g, right);
            const leftValue = walkExpr(g, left);
            expectComparable(g, rightValue, leftValue);
            return compare(rightValue, leftValue) === 0;
        }
        case 'lessThan': {
            const rightValue = walkExpr(g, right);
            const leftValue = walkExpr(g, left);
            expectComparable(g, rightValue, leftValue);
            const comparison = compare(rightValue, leftValue);
            return comparison < 0;
        }
        case 'greaterThan': {
            const rightValue = walkExpr(g, right);
            const leftValue = walkExpr(g, left);
            expectComparable(g, rightValue, leftValue);
            const comparison = compare(rightValue, leftValue);
            return comparison > 0;
        }
        case 'lessThanEq': {
            const rightValue = walkExpr(g, right);
            const leftValue = walkExpr(g, left);
            expectComparable(g, rightValue, leftValue);
            const comparison = compare(rightValue, leftValue);
            return comparison < 0 || comparison === 0;
        }
        case 'greaterThanEq': {
            const rightValue = walkExpr(g, right);
            const leftValue = walkExpr(g, left);
            expectComparable(g, rightValue, leftValue);
            const comparison = compare(rightValue, leftValue);
            return comparison > 0 || comparison === 0;
        }
        case 'bitAnd': {
            const rightValue = walkExpr(g, right);
            expectType(g, rightValue, 'boolean');
            const leftValue = walkExpr(g, left);
            expectType(g, leftValue, 'boolean');
            return (rightValue as boolean) && (leftValue as boolean);
        }
        case 'bitOr': {
            const rightValue = walkExpr(g, right);
            expectType(g, rightValue, 'boolean');
            const leftValue = walkExpr(g, left);
            expectType(g, leftValue, 'boolean');
            return (rightValue as boolean) || (leftValue as boolean);
        }
        case 'pipe': {
            if (left.tag !== 'apply') {
                throw new ExecutionError('Expression piped into must be function application');
            }

            let fn: Signature | any = null;
            const name = left.calle.name;
            if (exposed.has(name)) {
                fn = exposed.get(name);
            } else if (g.fns.has(name)) {
                fn = g.fns.get(name);
            } else {
                throw new ExecutionError(`Function \`${name}\` not found`);
            }

            const args: Value[] = [walkExpr(g, right)];
            for (let i = left.args.length - 1; i >= 0; i -= 1) {
                args.push(walkExpr(g, left.args[i]));
            }

            if (typeof fn === 'function') {
                const systemArgs: (Value | Global)[] = args;
                systemArgs.push(g);

                if (fn.length !== systemArgs.length) {
                    throw new ExecutionError(
                        `Function \`${name}\` requires \`${fn.length - 1}\` parameter(s), ` +
                        `\`${systemArgs.length - 1}\` arguments passed with pipe argument included`
                    );
                }

                return fn.apply(null, systemArgs.reverse());
            }

            const userFn = fn as Signature;
            if (userFn.params.length !== args.length) {
                throw new ExecutionError(
                    `Function \`${name}\` requires \`${userFn.params.length}\` parameter(s), ` +
                    `\`${args.length}\` argument(s) passed with pipe argument included`
                );
            }

            const oldVars = g.vars;
            const newVars = Map<string, Value>(
                args.reverse().map((arg, i) => [userFn.params[i].name, arg]));

            g.vars = newVars;
            const result = walkStats(g, userFn.body);
            g.vars = oldVars;
            return result;
        }
    }
}

const walkExpr = (g: Global, expr: Expr): Value => {
    switch (expr.tag) {
        case 'integer':
            return Long.fromString(expr.value, 10);
        case 'string':
            return expr.value;
        case 'boolean':
            return expr.value;
        case 'unit':
            return null;
        case 'unaOp':
            return walkUna(g, expr.opCode, expr.expr);
        case 'dosOp':
            return walkDos(g, expr.left, expr.opCode, expr.right);
        case 'apply': {
            let fn: Signature | any = null;
            const name = expr.calle.name;
            if (exposed.has(name)) {
                fn = exposed.get(name);
            } else if (g.fns.has(name)) {
                fn = g.fns.get(name);
            } else {
                throw new ExecutionError(`Function \`${name}\` not found`);
            }

            const args: Value[] = [];
            for (let i = expr.args.length - 1; i >= 0; i -= 1) {
                args.push(walkExpr(g, expr.args[i]));
            }

            if (typeof fn === 'function') {
                const systemArgs: (Value | Global)[] = args;
                systemArgs.push(g);
                if (fn.length !== systemArgs.length) {
                    throw new ExecutionError(
                        `Function \`${name}\` requires \`${fn.length - 1}\` parameter(s), ` +
                        `\`${systemArgs.length - 1}\` argument(s) passed`
                    )
                }

                return fn.apply(null, systemArgs.reverse());
            }

            const userFn = fn as Signature;
            if (userFn.params.length !== args.length) {
                throw new ExecutionError(
                    `Function \`${name}\` requires \`${userFn.params.length}\` parameter(s), ` +
                    `\`${args.length}\` argument(s) passed`
                )
            }

            const oldVars = g.vars;
            const newVars = Map<string, Value>(
                args.reverse().map((arg, i) => [userFn.params[i].name, arg]));

            g.vars = newVars;
            const result = walkStats(g, userFn.body);
            g.vars = oldVars;
            return result;
        }
        case 'ident': {
            const value = g.vars.get(expr.name);
            if (value === undefined) {
                throw new ExecutionError(`Variable \`${expr.name}\` not found`);
            }

            return value;
        }
        case 'if': {
            const cond = walkExpr(g, expr.cond);
            if (typeof cond !== 'boolean') {
                maercs(g, '`if` requires condition with type `boolean`');
            }

            const oldVars = g.vars;
            let result: Value | undefined = null;
            if (cond) {
                result = walkStats(g, expr.onTrue);
            } else {
                result = walkStats(g, expr.onFalse);
            }

            g.vars = oldVars;
            return result!;
        }
        case 'loop':
            const oldVars = g.vars;

            try {
                while (true) {
                    walkStats(g, expr.body);
                }
            } catch (err: unknown) {
                if (err instanceof BreakError) {
                    return err.value;
                }

                throw err;
            } finally {
                g.vars = oldVars;
            }
    }
}

class BreakError extends Error {
    readonly value: Value;

    constructor(value: Value) {
        super('Uncaught `stop`');
        this.value = value;

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, BreakError.prototype);
    }
}

const walkStat = (g: Global, stat: Stat): Value => {
    switch (stat.tag) {
        case 'expr':
            return walkExpr(g, stat.expr);
        case 'let': {
            const value = walkExpr(g, stat.expr);
            g.vars = g.vars.set(stat.name.name, value);
            return null;
        };
        case 'break': {
            const value = walkExpr(g, stat.expr);
            throw new BreakError(value);
        };
    }
}

const walkStats = (g: Global, stats: Stats): Value => {
    let result: Value | null = null;
    for (let i = stats.length - 1; i >= 0; i -= 1) {
        result = walkStat(g, stats[i]);
    }

    // Has to be defined because function bodies are required to be non-empty when parsed
    return result!;
}

const walk = (ast: Ast): string => {
    const fns = collectFns(ast);

    const entry = fns.get('eraweb');
    if (entry === undefined) {
        return 'Execution Error: no `eraweb` entrypoint function defined';
    }

    if (entry.params.length > 0) {
        return 'Execution Error: `eraweb` entrypoint function must have 0 parameters';
    }

    const g: Global = { fns, vars: Map(), outBuffer: [] };

    try {
        walkStats(g, entry.body);
        return g.outBuffer.join('');
    } catch (err: unknown) {
        if (err instanceof ExecutionError) {
            return `Execution Error: ${err.message}`;
        }

        if (err instanceof ScreamError) {
            return g.outBuffer.join('');
        }

        return `Bug Error: you should not see this \n...\nstack=${(err as Error).stack}`;
    }
};

export default walk;