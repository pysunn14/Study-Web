import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkDownProps {
    content : string
}
const MarkdownParser = ({content} : MarkDownProps) => {

    return (
        <div>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
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
                }}>
                {content}
            </ReactMarkdown>
        </div>
    )
}

export default MarkdownParser;