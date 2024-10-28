import { useState, useEffect } from "preact/hooks";

import Control from '~/web/part/Control';
import CodeEditor from '~/web/part/CodeEditor';
import Output from '~/web/part/Output';
import examples from "~/web/part/examples";
import Vid from "~/web/part/Vid";

import * as style from '~/web/App.module.css';

const key = 'codeSource';

export default function App() {
    const [code, setCode] = useState<string>(localStorage.getItem(key) ?? examples.helloWorld);
    // Preact does not provide the type to correctly check 'value'
    const onCode = (e: any) => setCode(e.target.value);
    useEffect(() => {
        localStorage.setItem(key, code);
    }, [code]);


    const [output, setOutput] = useState<string>('Waiting for execution...');

    const [isScared, setIsScared] = useState<boolean>(false);

    return <main className={style.mainBox}>
        <div className={style.taskBar}>
            <h1 className={style.titleText}>RedЯum Lang</h1>
            <Control
                code={code}
                setCode={setCode}
                setOutput={setOutput}
                setIsScared={setIsScared}
            />
        </div>

        <div className={style.editorBox}>
            <CodeEditor code={code} onCode={onCode} />
            <Output output={output} />
        </div>

        {isScared && <Vid />}
    </main>;
}