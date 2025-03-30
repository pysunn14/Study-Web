import "../styles/App.css"
import MarkdownViewer from "../util/MarkdownViewer.tsx";

export default function Home() {

    return (
        <>
            <main className="content">
                <h1>Home</h1>
                <MarkdownViewer fileName="intro.md"/>
            </main>
        </>
    );
}