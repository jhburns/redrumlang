import { Map } from 'immutable';
import Long from 'long';

import type { Ast, Ident, Stat, Stats, Expr } from 'src/astify';

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

type Value = Long | string | boolean | null | { tag: 'cell', value: Value };

interface Global {
    readonly fns: Fns,
    vars: Map<string, Value>,
}

const walkExpr = (g: Global, expr: Expr): Value => {
    return 'TODO';
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
        case 'loop':
            const oldVars = g.vars;

            try {
                while (true) {
                    walkStats(g, stat.body);
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

const walkStats = (g: Global, stats: Stats): Value => {
    let result: Value | null = null;
    for (let i = stats.length - 1; i >= 0; i -= 1) {
        result = walkStat(g, stats[i]);
    }

    // Has to be defined because function bodies are required to be non-empty when parsed
    return result!;
}

const walk = (ast: Ast): null | string => {
    const fns = collectFns(ast);

    const entry = fns.get('eraweb');
    if (entry === undefined) {
        return 'Execution Error: no `beware` entrypoint function defined';
    }

    if (entry.params.length > 0) {
        return 'Execution Error: `beware` entrypoint function must have 0 parameters';
    }

    const g: Global = { fns, vars: Map() };
    walkStats(g, entry.body);

    return null;
};

export default walk;