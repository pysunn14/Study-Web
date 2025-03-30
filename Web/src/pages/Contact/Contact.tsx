import "../../styles/App.css"
import { FaGithubSquare } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import { SiCodeforces } from "react-icons/si";
import { GiHorseHead } from "react-icons/gi";
import { IoIosMail } from "react-icons/io";

export default function Contact() {

    const contacts = [
        {
            name: "PYSUNN",
            links: [
                { icon: <FaGithubSquare />, label: "GITHUB", url: "https://github.com/pysunn14" },
                { icon: <FaCheck />, label: "SOLVED.AC", url: "https://solved.ac/profile/pysunn" },
                { icon: <SiCodeforces />, label: "CODEFORCES", url: "https://codeforces.com/profile/pysunn" },
                { icon: <GiHorseHead />, label: "ATCODER", url: "https://atcoder.jp/users/pysunn" },
                { icon: <IoIosMail />, label: "MAIL", url: "mailto:kminseok14@ajou.ac.kr" },
            ],
        },
        {
            name: "GANGTO",
            links: [
                { icon: <FaGithubSquare />, label: "GITHUB", url: "https://github.com/pjwoo1021" },
            ],
        },
    ];

    return (
        <>
            <main className="content">
                <h1>Contact</h1>

                {contacts.map((user) => (
                    <div key = {user.name}>
                        <h2>{user.name}</h2>
                        {
                            user.links.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="markdown-link items"
                                >
                                    {link.icon} {link.label} <FaExternalLinkAlt/>
                                </a>
                            ))
                        }
                    </div>
                ))}
            </main>
        </>
    );
}