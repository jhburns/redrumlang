import { useState } from "preact/hooks";

import Control from '~/web/part/Control';
import CodeEditor from '~/web/part/CodeEditor';
import Output from '~/web/part/Output';

export default function App() {
    const [code, setCode] = useState<string>('');
    // Preact does not provide the correct type to correctly check 'value'
    const onCode = (e: any) => setCode(e.target.value);

    const [output, setOutput] = useState<string>('');

    return <main className='main-box'>
        <h1>RedЯum Lang</h1>
        <Control code={code} setOutput={setOutput} />
        <CodeEditor code={code} onCode={onCode} />
        <Output output={output} />
    </main>;
}