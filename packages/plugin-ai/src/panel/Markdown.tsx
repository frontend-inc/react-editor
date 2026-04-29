import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// While streaming, the model may emit an opening ``` before its closing
// counterpart arrives, which causes everything after it (including future
// non-code text) to render as a code block until the close lands. Counting
// fence markers and appending a synthetic close keeps the bubble stable.
const balanceFences = (text: string) => {
  const fenceCount = (text.match(/```/g) ?? []).length;
  return fenceCount % 2 === 1 ? `${text}\n\`\`\`` : text;
};

export const Markdown = ({ text }: { text: string }) => {
  const safe = useMemo(() => balanceFences(text), [text]);
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{safe}</ReactMarkdown>;
};
