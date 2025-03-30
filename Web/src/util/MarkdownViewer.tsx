import MarkdownParser from "./MarkdownParser.tsx";
import {useEffect, useState} from "react";

interface Props {
    fileName: string;
}

const MarkdownViewer = ({fileName}: Props) => {

    const [content, setContent] = useState<string>("");

    const path = `${import.meta.env.BASE_URL}/markdowns`;
    useEffect(()=>{
        fetch(`${path}/${fileName}`)
            .then(res => res.text())
            .then((text) => setContent(text))
            .catch((err) => console.log(err));
    }, [fileName]);

    return (
        <div>
            <MarkdownParser content={content}/>
        </div>
    );
}

export default MarkdownViewer;