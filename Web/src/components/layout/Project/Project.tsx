import MarkdownParser from "../../util/MarkdownParser.tsx";

export default function Project() {


    const content = `
# Project
- 활동 결과물을 정리할 예정입니다. 

- 걍 내가 하고싶은거
1. CUDA Attention 구현  
2. PyTorch 모델 제작 

        `;

    return (
        <>
            <MarkdownParser content={content}></MarkdownParser>
        </>
    );
}