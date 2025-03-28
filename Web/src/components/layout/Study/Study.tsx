import MarkdownParser from "../../util/MarkdownParser.tsx";

export default function Study() {

    const content = `
## 예상 

* 공부 자료가 올라갈 예정입니다.

- ML / DL
- PS 
- Mathematics     
    `;

    return (
        <>
            <MarkdownParser content={content}></MarkdownParser>
        </>
    );
}