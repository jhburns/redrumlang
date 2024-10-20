
import astify from "src/astify";
import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scratch = fs.readFileSync(path.join(__dirname, 'scratch.rr'), 'utf-8');

console.log(astify(scratch));