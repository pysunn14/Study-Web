import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";
import "katex/dist/katex.min.css";
import "../styles/Markdowns.css"
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

interface MarkDownProps {
    content : string
}
const MarkdownParser = ({content} : MarkDownProps) => {

    return (
        <div>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    h1({node, children, ...props}) {
                        return <h1 className="markdown-h1" {...props}>{children}</h1>
                    },

                    blockquote({node, children, ...props}) {
                        return <blockquote className="blockquote" {...props}>{children}</blockquote>
                    },

                    strong({node, children, ...props}) {
                        return <strong className="markdown-strong" {...props}>{children}</strong>;
                    },
                    code({ node, className, children, style, ref, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                            <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            // 안 맞다면 문자열 형태로 반환
                            <code {...props} className="inline-code">
                                {children}
                            </code>
                        );
                    },
                    a({node, href, children, ...props}) {
                        return (
                            <a
                                href={href}
                                className="markdown-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                {...props}
                            >
                                {children}
                            </a>
                        );
                    },
                }}>
                {content}
            </ReactMarkdown>
        </div>
    )
}

export default MarkdownParser;