import { useState, useEffect, type Dispatch, type StateUpdater } from "preact/hooks";

import redrum from "~/src/redrumlang";
import examples from "~/web/part/examples";

import * as style from '~/web/part/Control.module.css';

interface ControlProps {
    code: string,
    setCode: Dispatch<StateUpdater<string>>,
    setOutput: Dispatch<StateUpdater<string>>,
    setIsScared: Dispatch<StateUpdater<boolean>>
}

type Example = 'default' | 'helloWorld' | 'fib' | 'tutorial';

const allExamples = new Map<string, Example>([
    [examples.helloWorld, 'helloWorld'],
    [examples.fib, 'fib'],
    [examples.tutorial, 'tutorial'],
]);

export default function Control(props: ControlProps) {
    const onExecute = () => {
        props.setOutput('Executing...');

        const run = () => {
            const output = redrum(props.code)
            props.setOutput(output);

            if (!output.includes('Error') && !output.includes('Scream')) {
                return;
            }

            if (Math.random() > 0.25) {
                return;
            }

            props.setIsScared(true);
            setTimeout(() => props.setIsScared(false), 2 * 1000);
        }

        // This forces preact to debatch these updates
        setTimeout(run);
    }

    const [example, setExample] = useState<Example>('default');

    const onSelect = (e: any) => {
        const value: Example = e.target!.value;

        if (value === 'helloWorld') {
            props.setCode(examples.helloWorld);
        } else if (value === 'fib') {
            props.setCode(examples.fib);
        } else {
            props.setCode(examples.tutorial);
        }
    }

    useEffect(() => {
        if (allExamples.has(props.code)) {
            setExample(allExamples.get(props.code)!);
        }
    }, [props.code]);

    const onOpenSelect = () => {
        setExample('default');
    }

    const onOpenClose = () => {
        if (allExamples.has(props.code)) {
            setExample(allExamples.get(props.code)!);
        }
    }

    return <>
        <button onClick={onExecute} className={style.executeButton}>
            Execute
        </button>

        <select
            aria-label='Example Programs'
            onChange={onSelect}
            onFocus={onOpenSelect}
            onBlur={onOpenClose}
            value={example}
            className={style.exampleSelect}
        >
            <option value="default" disabled hidden className={style.programOption}>Example Programs</option>
            <option value="helloWorld" className={style.programOption}>Hello World</option>
            <option value="fib" className={style.programOption}>Fibonacci</option>
            <option value="tutorial" className={style.programOption}>Tutorial</option>
        </select>
    </>
} 