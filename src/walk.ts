import type { Ast, Ident, Stats } from 'src/astify';
import { Map } from 'immutable';

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

const walk = (ast: Ast): null | string => {
    const fns = collectFns(ast);

    console.log(fns.toJSON());

    return 'TODO';
};

export default walk;