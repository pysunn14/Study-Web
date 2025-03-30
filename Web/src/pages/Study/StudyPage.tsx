import {Link} from "react-router-dom";
import "../../styles/App.css";
import MarkdownViewer from "../../util/MarkdownViewer.tsx";

export default function StudyPage() {

    const categories = ["Mathematics", "AI", "Algorithm"]

    return (
        <>
            <h1> Study </h1>
            <br/><br/><br/>

            <ul>
                {categories.map((category) => (
                    <p key={category}>
                        <Link to={`/study/${category}`} className="link">{category.toUpperCase()}</Link>
                        <br/>
                        <br/>
                        <br/>
                    </p>
                ))}
            </ul>

            <div>
                <MarkdownViewer fileName={'study.md'}/>
            </div>
        </>
    );
}