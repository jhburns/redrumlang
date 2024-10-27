import * as style from "~/web/part/CodeEditor.module.css";

interface CodeEditorProps {
    code: string,
    onCode: (e: any) => void,
}

export default function CodeEditor(props: CodeEditorProps) {
    return <textarea
        className={style.codeEditor}
        value={props.code}
        onChange={props.onCode}
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck={false}
        aria-label="Code Editor"
        cols={80}
    />
} 