import MarkdownParser from "./MarkdownParser.tsx";
import {useEffect, useState} from "react";

interface Props {
    fileName: string;
}

const About = ({fileName}: Props) => {

    const [content, setContent] = useState<string>("");

    useEffect(()=>{
        fetch(`/markdowns/${fileName}`)
            .then(res => res.text())
            .then((text) => setContent(text))
            .catch((err) => console.log(err));
    }, [fileName]);

    return (
        <div>
            <MarkdownParser content={content} />
        </div>
    );
}

export default About;