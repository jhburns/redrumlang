import { useState } from "preact/hooks";
import { useLocalStorage } from "usehooks-ts";

import Control from '~/web/part/Control';
import CodeEditor from '~/web/part/CodeEditor';
import Output from '~/web/part/Output';
import examples from "~/web/part/examples";

export default function App() {
    const [code, setCode] = useLocalStorage<string>('editorSource', examples.helloWorld);
    // Preact does not provide the type to correctly check 'value'
    const onCode = (e: any) => setCode(e.target.value);

    const [output, setOutput] = useState<string>('Waiting for output...');

    return <main className='main-box'>
        <h1>RedЯum Lang</h1>
        <Control code={code} setCode={setCode} setOutput={setOutput} />
        <CodeEditor code={code} onCode={onCode} />
        <Output output={output} />
    </main>;
}