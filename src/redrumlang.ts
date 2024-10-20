
import fs from 'fs';
import path from 'path';
import url from 'url';

import astify from 'src/astify';
import walk from 'src/walk';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scratch = fs.readFileSync(path.join(__dirname, 'scratch.rr'), 'utf-8');

const ast = astify(scratch);
console.log(ast);

if (typeof ast !== 'string') {
    console.log(walk(ast));
}