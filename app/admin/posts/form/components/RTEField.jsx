import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { usePostForm } from "../contexts/PostFormContext";
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css"; // Import the highlight.js theme

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
      [{ size: ["extra-small", "small", "medium", "large"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  },
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value, // Enable syntax highlighting
  },
};

export function RTEField() {
  const { data, handleData } = usePostForm();

  const handleChange = (value) => {
    handleData("content", value);
  };

  useEffect(() => {
    // Ensure highlight.js is loaded and configured before rendering the editor
    hljs.configure({
      languages: ["javascript", "python", "ruby", "go", "java", "html", "css"],
    });
  }, []);

  return (
    <div>
      <ReactQuill
        value={data?.content}
        onChange={handleChange}
        modules={modules}
        placeholder="Enter your content here..."
      />
    </div>
  );
}
