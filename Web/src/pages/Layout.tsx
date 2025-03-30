import Header from "../components/layout/Header.tsx";
import Footer from "../components/layout/Footer.tsx";
import {Outlet} from "react-router-dom";

import "../styles/App.css"

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