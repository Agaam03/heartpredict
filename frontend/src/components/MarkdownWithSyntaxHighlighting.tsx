"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Untuk GitHub Flavored Markdown (GFM)
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"; // Gaya Syntax Highlighting

interface MarkdownWithSyntaxHighlightingProps {
  content: string;
}

const MarkdownWithSyntaxHighlighting: React.FC<
  MarkdownWithSyntaxHighlightingProps
> = ({ content }) => {
  return (
    <div className="prose prose-pink max-w-none text-white/80 tracking-wide">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          ol({ children }) {
            return (
              <ol className="list-decimal pl-6 text-pink-500">{children}</ol>
            );
          },
          ul({ children }) {
            return <ul className="list-disc pl-6 text-white/80">{children}</ul>;
          },
          code({
            inline,
            className,
            children,
            ...props
          }: {
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
          }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark as any}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownWithSyntaxHighlighting;
