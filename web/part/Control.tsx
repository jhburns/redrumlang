import type { Dispatch, StateUpdater } from "preact/hooks";
import redrum from "~/src/redrumlang";

interface ControlProps {
    code: string,
    setOutput: Dispatch<StateUpdater<string>>,
}

export default function Control(props: ControlProps) {
    return <div>
        <button onClick={() => props.setOutput(redrum(props.code))}>
            Execute
        </button>

        {/* <button>Я</button> */}

        <select name="examples" aria-label='Example Programs'>
            <option value="helloWorld">Hello World</option>
            <option value="fib">Fibonacci</option>
            <option value="tutorial">Tutorial</option>
        </select>
    </div>
} 