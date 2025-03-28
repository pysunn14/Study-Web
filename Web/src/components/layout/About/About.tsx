import MarkdownParser from "../../util/MarkdownParser.tsx";

export default function About() {

    const content = `
    
# About
- 스터디 그룹 멤버들의 간단한 이력 사항이 정리될 예정입니다. 

## Member
    
    `;
    return (
        <>
            <MarkdownParser content={content}></MarkdownParser>
        </>
    )
}