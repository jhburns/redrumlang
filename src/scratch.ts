
import fs from 'fs';
import path from 'path';
import url from 'url';

import redrum from '/src/redrumlang';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scratch = fs.readFileSync(path.join(__dirname, 'scratch.rr'), 'utf-8');

console.log(redrum(scratch));