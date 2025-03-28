import './App.css'
import {Link, Route, Routes} from "react-router-dom";
import Study from "./components/Study.tsx";
import About from "./components/About.tsx";
import Home from "./components/Home.tsx";
import Contact from "./components/Contact.tsx";
import Project from "./components/Project.tsx";

export default function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Mock Gun In</h1>

      <div>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/study" element={<Study />} />
              <Route path="/project" element={<Project />} />
              <Route path="/contact" element={<Contact />} />
          </Routes>

          <div className="gap-10 justify-center flex m-3">
            <Link to={"/"}>
                <button>Home</button>
            </Link>

            <Link to={"/about"}>
                <button>About</button>
            </Link>

            <Link to={"/study"}>
                <button>Study</button>
            </Link>

            <Link to={"/project"}>
                <button>Project</button>
            </Link>

            <Link to={"/contact"}>
                <button>Contact</button>
            </Link>
          </div>
      </div>
    </>
  )
}
