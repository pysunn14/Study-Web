import MarkdownParser from "../util/MarkdownParser.tsx";

export default function Home() {


    const content = `

[o](https://www.acmicpc.net/problem/31931)    
    `;

    return (
        <>
            <MarkdownParser content={content}></MarkdownParser>
        </>
    );

}