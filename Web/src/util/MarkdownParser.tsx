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
                    code({ node, className, children, style, ref, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                            <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div" {...props}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            // 안 맞다면 문자열 형태로 반환
                            <code {...props} className={className}>
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