import React, { useState, useEffect, useCallback, useMemo } from "react";
import { usePostForm } from "../contexts/PostFormContext";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(
async () => {
const { default: RQ } = await import("react-quill");
if (typeof window !== "undefined") {
const { default: ImageResize } = await import(
"quill-image-resize-module-react"
);
const { default: MagicUrl } = await import("quill-magic-url");
RQ.Quill.register("modules/imageResize", ImageResize);
RQ.Quill.register("modules/magicUrl", MagicUrl);
}
return function forwardRef({ forwardedRef, ...props }) {
return <RQ ref={forwardedRef} {...props} />;
};
},
{ ssr: false }
);

hljs.configure({
languages: ["javascript", "python", "ruby", "go", "java", "html", "css"],
});

export function RTEField() {
const { data, handleData } = usePostForm();
const [editorContent, setEditorContent] = useState("");
const [activeTab, setActiveTab] = useState("editor");
const [wordCount, setWordCount] = useState(0);
const [charCount, setCharCount] = useState(0);
const [readingTime, setReadingTime] = useState(0);
const [autoSaveStatus, setAutoSaveStatus] = useState("Saved");
const [contentScore, setContentScore] = useState(0);
const [showAnalysis, setShowAnalysis] = useState(false);
const quillRef = React.useRef(null);

useEffect(() => {
if (data?.content) {
setEditorContent(data.content);
}
}, [data?.content]);

useEffect(() => {
if (activeTab === "preview") {
setTimeout(() => {
document.querySelectorAll("pre code").forEach((block) => {
hljs.highlightBlock(block);
});
}, 0);
}
}, [activeTab, editorContent]);

const handleContentChange = useCallback(
(content) => {
setEditorContent(content);
handleData("content", content);
analyzeContent(content);
setAutoSaveStatus("Saving...");
setTimeout(() => setAutoSaveStatus("Saved"), 1000);
},
[handleData]
);

const analyzeContent = useCallback((content) => {
const text = content.replace(/<[^>]*>/g, "");
const words = text.trim().split(/\s+/);
setWordCount(words.length);
setCharCount(text.length);
setReadingTime(Math.ceil(words.length / 200));

const uniqueWords = new Set(words).size;
const score = Math.min(
100,
Math.floor((uniqueWords / words.length) * 100) +
Math.min(50, words.length / 10)
);
setContentScore(score);
}, []);

const modules = useMemo(
() => ({
toolbar: [
[{ header: [1, 2, 3, 4, 5, 6, false] }],
["bold", "italic", "underline", "strike"],
[{ list: "ordered" }, { list: "bullet" }],
[{ script: "sub" }, { script: "super" }],
[{ indent: "-1" }, { indent: "+1" }],
[{ direction: "rtl" }],
[{ color: [] }, { background: [] }],
[{ font: [] }],
[{ align: [] }],
["blockquote", "code-block"],
["link", "image", "video"],
["clean"],
],
syntax: {
highlight: (text) => hljs.highlightAuto(text).value,
},
imageResize: {
parchment: quillRef.current
? quillRef.current.getEditor().import("parchment")
: null,
modules: ["Resize", "DisplaySize"],
},
magicUrl: true,
}),
[quillRef]
);

const formats = [
"header",
"bold",
"italic",
"underline",
"strike",
"list",
"bullet",
"script",
"indent",
"direction",
"color",
"background",
"font",
"align",
"blockquote",
"code-block",
"link",
"image",
"video",
];

return (
<div className="dark:text-white">
<div className="mb-4">
<button
className={`text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${
activeTab === "editor"
? "bg-blue-500 text-white"
: "bg-gray-200 text-gray-700"
}`}
onClick={() => setActiveTab("editor")}
>
Editor
</button>
<button
className={`text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${
activeTab === "preview"
? "bg-blue-500 text-white"
: "bg-gray-200 text-gray-700"
}`}
onClick={() => setActiveTab("preview")}
>
Preview
</button>
</div>

{activeTab === "editor" ? (
<div className="editor-container" style={{ height: "500px" }}>
<ReactQuill
forwardedRef={quillRef}
theme="snow"
value={editorContent}
onChange={handleContentChange}
modules={modules}
formats={formats}
style={{ height: "100%" }}
/>
</div>
) : (
<div className="p-4 bg-gray-100 border rounded dark:bg-gray-800 ">
<h3 className="mb-2 text-lg font-semibold">Preview</h3>
<div
className="prose-sm prose sm:prose lg:prose-lg xl:prose-xl dark:prose-invert max-w-none dark:text-white"
dangerouslySetInnerHTML={{ __html: editorContent }}
/>
</div>
)}

<div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
<p>
Words: {wordCount} | Characters: {charCount} | Reading time:{" "}
{readingTime} min
</p>
<p>Auto-save status: {autoSaveStatus}</p>
</div>

<div className="mt-2">
<p className="mb-1 text-sm font-semibold">
Content Quality Score: {contentScore}/100
</p>
<div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
<div
className="bg-blue-600 h-2.5 rounded-full"
style={{ width: `${contentScore}%` }}
></div>
</div>
</div>

<div className="mt-4">
<button
className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-md"
onClick={() => setShowAnalysis(!showAnalysis)}
>
Content Analysis
</button>
</div>

{showAnalysis && (
<div className="p-4 mt-4 bg-gray-100 rounded dark:bg-gray-800">
<h4 className="mb-2 text-lg font-semibold">Content Analysis</h4>
<p>
Your content has a quality score of {contentScore}/100. This score
is based on the length and variety of your writing. To improve:
</p>
<ul className="mt-2 list-disc list-inside">
<li>Add more unique words to increase vocabulary diversity</li>
<li>
Aim for a longer piece to cover the topic more comprehensively
</li>
<li>
Use a mix of short and long sentences for better readability
</li>
</ul>
</div>
)}
</div>
);
}
