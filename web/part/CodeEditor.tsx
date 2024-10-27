interface CodeEditorProps {
    code: string,
    onCode: (e: any) => void,
}

export default function CodeEditor(props: CodeEditorProps) {
    return <textarea
        value={props.code}
        onChange={props.onCode}
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck={false}
        aria-label="Code Editor"
    />
} 