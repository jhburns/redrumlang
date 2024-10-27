import * as style from '~/web/part/Output.module.css';

interface OutputProps {
    output: string
}

export default function Output(props: OutputProps) {
    return <p className={style.outputText}>
        {props.output}
    </p>;
} 