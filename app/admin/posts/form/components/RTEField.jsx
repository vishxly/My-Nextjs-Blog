import React, { useRef, useEffect, useState, useMemo } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { usePostForm } from "../contexts/PostFormContext";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

export function RTEField() {
  const { data, handleData } = usePostForm();
  const editorRef = useRef(null);
  const [previewContent, setPreviewContent] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState("Saved");
  const [contentScore, setContentScore] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleChange = (content) => {
    handleData("content", content);
    setPreviewContent(content);
    analyzeContent(content);
    setAutoSaveStatus("Saving...");
    setTimeout(() => setAutoSaveStatus("Saved"), 1000); // Simulated auto-save
  };

  const analyzeContent = (content) => {
    const words = content.trim().split(/\s+/);
    setWordCount(words.length);
    setCharCount(content.length);
    setReadingTime(Math.ceil(words.length / 200)); // Assuming 200 words per minute reading speed
    
    // Simple content quality score based on length and variety
    const uniqueWords = new Set(words).size;
    const score = Math.min(100, Math.floor((uniqueWords / words.length) * 100) + Math.min(50, words.length / 10));
    setContentScore(score);
  };

  useEffect(() => {
    hljs.configure({
      languages: ["javascript", "python", "ruby", "go", "java", "html", "css"],
    });

    if (editorRef.current) {
      editorRef.current.on("PastePostProcess", (event) => {
        event.content = formatContent(event.content);
      });
    }
  }, []);

  const formatContent = (content) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    tempDiv.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightBlock(block);
    });

    // Auto-detect and format links
    const linkRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    tempDiv.innerHTML = tempDiv.innerHTML.replace(linkRegex, '<a href="$1" target="_blank">$1</a>');

    return tempDiv.innerHTML;
  };

  const customPlugins = useMemo(() => [
    {
      name: 'autodetect',
      init: (editor) => {
        editor.on('KeyUp', () => {
          const content = editor.getContent();
          editor.setContent(formatContent(content));
        });
      }
    }
  ], []);

  return (
    <div className="dark:text-white">
      <div className="mb-4">
        <button 
          className={` text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${activeTab === 'editor' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('editor')}
        >
          Editor
        </button>
        <button 
          className={`text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${activeTab === 'preview' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>

      {activeTab === 'editor' ? (
        <Editor
          apiKey="2zhf2cw2rpzcffhcfj8ui8hq6nm22cjny9miyay444w5vh2g"
          onInit={(_evt, editor) => (editorRef.current = editor)}
          initialValue={data?.content || "<p>Start writing your content here...</p>"}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
              "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
              "insertdatetime", "media", "table", "code", "help", "wordcount",
              "codesample",
            ],
            toolbar: "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "codesample | link image | removeformat | help",
            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            paste_data_images: true,
            paste_as_text: false,
            automatic_uploads: true,
            paste_enable_default_filters: false,
            paste_postprocess: (pluginApi, args) => {
              args.node.innerHTML = formatContent(args.node.innerHTML);
            },
            setup: (editor) => {
              editor.ui.registry.addButton('customAutoDetect', {
                text: 'Auto-detect',
                onAction: () => {
                  const content = editor.getContent();
                  editor.setContent(formatContent(content));
                }
              });
            }
          }}
          onEditorChange={handleChange}
        />
      ) : (
        <div className="p-4 bg-gray-100 border rounded dark:bg-gray-800">
          <h3 className="mb-2 text-lg font-semibold">Preview</h3>
          <div
            className="prose preview-content dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: previewContent }}
          />
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>Words: {wordCount} | Characters: {charCount} | Reading time: {readingTime} min</p>
        <p>Auto-save status: {autoSaveStatus}</p>
      </div>

      <div className="mt-2">
        <p className="mb-1 text-sm font-semibold">Content Quality Score: {contentScore}/100</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${contentScore}%`}}></div>
        </div>
      </div>

      <div className="mt-4">
        <button 
          className="px-4 py-2 mr-2 text-white bg-blue-500 rounded-md"
          onClick={() => setShowAnalysis(!showAnalysis)}
        >
          Content Analysis
        </button>
        {/* <button className="px-4 py-2 text-gray-700 bg-gray-200 rounded">
          Export as PDF
        </button> */}
      </div>

      {showAnalysis && (
        <div className="p-4 mt-4 bg-gray-100 rounded dark:bg-gray-800">
          <h4 className="mb-2 text-lg font-semibold">Content Analysis</h4>
          <p>Your content has a quality score of {contentScore}/100. This score is based on the length and variety of your writing. To improve:</p>
          <ul className="mt-2 list-disc list-inside">
            <li>Add more unique words to increase vocabulary diversity</li>
            <li>Aim for a longer piece to cover the topic more comprehensively</li>
            <li>Use a mix of short and long sentences for better readability</li>
          </ul>
        </div>
      )}
    </div>
  );
}
// import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import "react-quill/dist/quill.snow.css";
// import { usePostForm } from "../contexts/PostFormContext";
// import hljs from "highlight.js";
// import "highlight.js/styles/monokai-sublime.css"; // Import the highlight.js theme

// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// const modules = {
//   toolbar: {
//     container: [
//       [{ header: [1, 2, false] }],
//       ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
//       [{ size: ["extra-small", "small", "medium", "large"] }],
//       [{ list: "ordered" }, { list: "bullet" }],
//       ["link", "image", "video"],
//       [{ color: [] }, { background: [] }],
//       ["clean"],
//     ],
//   },
//   syntax: {
//     highlight: (text) => hljs.highlightAuto(text).value, // Enable syntax highlighting
//   },
// };

// export function RTEField() {
//   const { data, handleData } = usePostForm();

//   const handleChange = (value) => {
//     handleData("content", value);
//   };

//   useEffect(() => {
//     // Ensure highlight.js is loaded and configured before rendering the editor
//     hljs.configure({
//       languages: ["javascript", "python", "ruby", "go", "java", "html", "css"],
//     });
//   }, []);

//   return (
//     <div className="dark:text-white">
//       <ReactQuill
//         value={data?.content}
//         onChange={handleChange}
//         modules={modules}
//         placeholder="Enter your content here..."
//       />
//     </div>
//   );
// }
