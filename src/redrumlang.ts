
import astify from '/src/astify';
import walk from '/src/walk';

const redrum = (source: string): string => {
    const ast = astify(source);

    if (typeof ast === 'string') {
        return ast;
    }

    return walk(ast);
}

export default redrum;