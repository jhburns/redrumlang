import type { Ast } from 'src/ast';

const walk = (ast: Ast): number => {
    if (typeof ast === 'number') {
        return ast;
    }

    if (ast.tag === 'add') {
        return walk(ast.left) + walk(ast.right);
    }

    return walk(ast.left) * walk(ast.right);
};

export default walk;