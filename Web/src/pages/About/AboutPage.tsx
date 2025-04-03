import {Link} from "react-router-dom";
import "../../styles/App.css";
import MarkdownViewer from "../../util/MarkdownViewer.tsx";

export default function AboutPage() {

    const users = ["pysunn", "gangto"];

    return (
        <>
            <h1>About</h1>
            <MarkdownViewer fileName='about/about.md'></MarkdownViewer>
            <br/>
            <br/>
            <br/>

            <ul>
                {users.map((user) => (
                    <p key={user}>
                        <Link to={`/about/${user}`} className="link">{user.toUpperCase()}</Link>
                        <br/>
                        <br/>
                    </p>
                ))}
            </ul>
        </>
    );
}