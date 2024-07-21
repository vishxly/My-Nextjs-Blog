// app/posts/[postId]/PostContent.jsx
"use client";

import { useEffect } from "react";
import hljs from "highlight.js";

export default function PostContent({ content }) {
  useEffect(() => {
    hljs.highlightAll();
  }, [content]);

  return (
    <div
      className="post-content prose dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: content }}
    ></div>
  );
}
