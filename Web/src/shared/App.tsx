import Layout from "../pages/Layout.tsx";
import {Route, Routes} from "react-router-dom";
import Home from "../pages/Home.tsx";
import About from "../pages/About/About.tsx";
import Study from "../pages/Study/Study.tsx";
import Project from "../pages/Project/Project.tsx";
import Contact from "../pages/Contact/Contact.tsx";

import "../styles/App.css";
import StudyPage from "../pages/Study/StudyPage.tsx";
import PostList from "../components/post/PostList.tsx";
import PostDetail from "../components/post/PostDetail.tsx";
import AboutPage from "../pages/About/AboutPage.tsx";
import User from "../pages/About/User.tsx";

export default function App() {
  return (
    <div className="app-container">
        <Routes>
            <Route path="/" element={<Layout/>}>

                <Route path="/" element={<Home/>}/>

                <Route path="/about" element={<About/>}>
                    <Route path="/about" element={<AboutPage />}/>
                    <Route path="/about/:user" element={<User />}/>

                </Route>

                <Route path="/study" element={<Study/>}>
                    <Route path="/study" element={<StudyPage/>}/>
                    <Route path="/study/:category" element={<PostList />}/>
                    <Route path="/study/:category/:postId" element={<PostDetail />} />
                </Route>

                <Route path="/project" element={<Project/>}/>

                <Route path="/contact" element={<Contact/>}/>
            </Route>
        </Routes>
    </div>
  )
}
