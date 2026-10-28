"use client";

import { isValidElement, useState, useRef, ReactNode } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGE_MAP: Record<string, string> = {
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  js: "JavaScript",
  javascript: "JavaScript",
  jsx: "JSX",
  py: "Python",
  python: "Python",
  sh: "Bash",
  bash: "Bash",
  shell: "Bash",
  zsh: "Zsh",
  json: "JSON",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  sql: "SQL",
  yaml: "YAML",
  yml: "YAML",
  md: "Markdown",
  markdown: "Markdown",
  mdx: "MDX",
  rust: "Rust",
  rs: "Rust",
  go: "Go",
  golang: "Go",
  docker: "Docker",
  dockerfile: "Dockerfile",
  graphql: "GraphQL",
  diff: "Diff",
  xml: "XML",
  toml: "TOML",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  cs: "C#",
  java: "Java",
  kotlin: "Kotlin",
  swift: "Swift",
  powershell: "PowerShell",
  ps1: "PowerShell",
  pwsh: "PowerShell",
  cmd: "Command Prompt",
  bat: "Batch",
  git: "Git",
  text: "Text",
  txt: "Text",
  plaintext: "Text",
  console: "Console",
};

interface PreProps extends React.HTMLAttributes<HTMLPreElement> {
  children?: ReactNode;
  "data-language"?: string;
  "data-theme"?: string;
}

/** Recursively extracts plain text from React nodes. */
function getNodeText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (typeof node === "object" && "props" in node) {
    return getNodeText(
      (node as { props: { children?: ReactNode } }).props.children,
    );
  }
  return "";
}

/**
 * Enhanced CodeBlock component for MDX with syntax highlighting,
 * prominent language label, and one-click copy button.
 */
export function CodeBlock({ children, className, ...props }: PreProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  // Shiki stamps `data-language` on the blocks it highlights. A fence in a
  // language it has no grammar for (```git) is left unhighlighted, and the
  // language survives only as `language-…` on the inner <code>.
  const codeClassName = isValidElement<{ className?: string }>(children)
    ? children.props.className
    : undefined;
  const rawLanguage =
    props["data-language"] ||
    (`${className ?? ""} ${codeClassName ?? ""}`.match(
      /language-([a-zA-Z0-9_+#-]+)/,
    )?.[1] ??
      "");

  const displayLanguage = rawLanguage
    ? LANGUAGE_MAP[rawLanguage.toLowerCase()] ||
      rawLanguage.charAt(0).toUpperCase() + rawLanguage.slice(1)
    : "Code";

  const handleCopy = async () => {
    try {
      let textToCopy = "";
      if (preRef.current) {
        textToCopy = preRef.current.innerText;
      } else {
        textToCopy = getNodeText(children);
      }

      // Trim any trailing newline artifact
      textToCopy = textToCopy.replace(/\n$/, "");

      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback for older contexts
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="code-block-wrapper my-6 overflow-hidden rounded-lg border border-border-strong bg-bg-surface transition-colors duration-200">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between border-b border-border-strong bg-bg-surface px-4 py-2 text-small">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
          <span className="font-mono text-small font-medium tracking-label text-fg">
            {displayLanguage}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Copied code" : "Copy code to clipboard"}
          className="code-copy-btn btn btn--secondary btn--sm"
        >
          {copied ? (
            <>
              <Check aria-hidden="true" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy aria-hidden="true" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre
        ref={preRef}
        {...props}
        className={cn(
          "code-block-pre !m-0 !rounded-none !border-0 overflow-x-auto p-4 font-mono text-small leading-relaxed bg-bg-raised text-fg",
          className,
        )}
      >
        {children}
      </pre>
    </div>
  );
}
