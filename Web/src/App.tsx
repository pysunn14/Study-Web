import Layout from "./components/layout/Layout.tsx";
import {Route, Routes} from "react-router-dom";
import Home from "./components/layout/Home.tsx";
import About from "./components/layout/About/About.tsx";
import Study from "./components/layout/Study/Study.tsx";
import Project from "./components/layout/Project/Project.tsx";
import Contact from "./components/layout/Contact/Contact.tsx";

import "./styles/App.css";

export default function App() {
  return (
    <div className="app-container">
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/study" element={<Study/>}/>
                <Route path="/project" element={<Project/>}/>
                <Route path="/contact" element={<Contact/>}/>
            </Route>
        </Routes>
    </div>
  )
}
