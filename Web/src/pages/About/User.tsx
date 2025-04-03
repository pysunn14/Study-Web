import MarkdownViewer from "../../util/MarkdownViewer.tsx";
import {useParams} from "react-router-dom";

export default function User() {

    const { user } = useParams();

    return (
        <>
            <h1>{ user?.toUpperCase()}</h1>
            <MarkdownViewer fileName={`about/${user}.md`}/>
        </>
    )
}