import {mdType} from "../../util/mdType.ts";
import MarkdownParser from "../../util/MarkdownParser.tsx";

    const Content = () => {

        const md : mdType = {
            title : "Markdown test",
            category: "Markdown",
            date : "2018-06-01",
            description : "des",
            content: "# 테스트입니다."
        };

        return (
            <div className="content">

                <h1>{md.title}</h1>
                <p>{md.description}</p>
                <p>{md.date}</p>

                <MarkdownParser content={md.content} />
            </div>
        )
    }

export default Content;