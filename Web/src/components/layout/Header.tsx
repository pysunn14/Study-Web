import { Link } from "react-router-dom";

import "../../styles/App.css"

export default function Header() {
    return (
        <>
            <h1>Mock Gun In's AI Blog</h1>
            <div>
                <nav>
                    <ul className="nav-list">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/study">Study</Link></li>
                        <li><Link to="/project">Project</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </nav>
            </div>
        </>
    )
}