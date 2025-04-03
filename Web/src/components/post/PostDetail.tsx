import MarkdownViewer from "../../util/MarkdownViewer.tsx";
import {useParams} from "react-router-dom";

export default function PostDetail() {

    const file = useParams();

    return (
        <>
            <p>{file.category}</p>
            <MarkdownViewer fileName={`study/${file.category}/${file.postId}.md`}/>
        </>
    )
}