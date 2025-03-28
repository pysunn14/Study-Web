import MarkdownParser from "../../util/MarkdownParser.tsx";

export default function Contact() {


    const content = `
# Contact

# 대표 링크 

[Pysunn](https://github.com/pysunn14) 

[Gangto](https://github.com/pjwoo1021)
        `;

    return (
        <>
            <MarkdownParser content={content}></MarkdownParser>
        </>
    );
}