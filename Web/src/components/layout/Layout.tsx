import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import {Outlet} from "react-router-dom";

import "../../styles/App.css"

export default function Layout() {
    return (
        <div>
            <Header />

            <main className="content">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}