import Control from '/web/part/Control';
import CodeEditor from '/web/part/CodeEditor';
import Output from '/web/part/Output';

export default function App() {
    return <main className='main-box'>
        <h1>RedЯum Lang</h1>
        <Control />
        <CodeEditor />
        <Output />
    </main>;
}