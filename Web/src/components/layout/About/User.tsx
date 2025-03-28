import MarkdownViewer from "../../util/MarkdownViewer.tsx";

export default function User(props: string) {

    return (
        <>
            <h1>{props}</h1>
            <MarkdownViewer fileName={props + ".md"}/>
        </>
    )
}