import {Outlet} from "react-router-dom";
import "../../styles/App.css"

export default function Study() {

    return (
        <>
            <main className="content">
                <Outlet/>
            </main>
        </>
    );
}