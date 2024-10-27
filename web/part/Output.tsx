interface OutputProps {
    output: string
}

export default function Output(props: OutputProps) {
    return <p className="output-text">
        {props.output}
    </p>
} 