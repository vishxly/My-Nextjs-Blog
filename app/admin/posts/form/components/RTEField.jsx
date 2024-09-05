import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { usePostForm } from "../contexts/PostFormContext";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

export function RTEField() {
  const { data, handleData } = usePostForm();
  const editorRef = useRef(null);
  const [previewContent, setPreviewContent] = useState(
    "<p>This is the initial content of the editor.</p>"
  ); // Initialize with default content
  const [activeTab, setActiveTab] = useState("editor");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState("Saved");
  const [contentScore, setContentScore] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.editor;

      hljs.configure({
        languages: [
          "javascript",
          "python",
          "ruby",
          "go",
          "java",
          "html",
          "css",
        ],
      });

      editor.ui.registry.addButton("customformat", {
        text: "Format Content",
        onAction: formatEntireContent,
      });

      editor.on("PastePreProcess", (e) => {
        e.content = formatContent(e.content);
      });
    }
  }, []);

  const formatContent = (content) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    tempDiv.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightBlock(block);
    });

    const linkRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    tempDiv.innerHTML = tempDiv.innerHTML.replace(
      linkRegex,
      '<a href="$1" target="_blank">$1</a>'
    );

    return tempDiv.innerHTML;
  };

  const formatEntireContent = () => {
    if (editorRef.current) {
      const editor = editorRef.current.editor;
      const content = editor.getContent();
      const formattedContent = formatContent(content);
      editor.setContent(formattedContent);
    }
  };

  const handleChange = (content) => {
    handleData("content", content);
    setPreviewContent(content); // Update the content state
    analyzeContent(content);
    setAutoSaveStatus("Saving...");
    setTimeout(() => setAutoSaveStatus("Saved"), 1000);
  };

  const analyzeContent = (content) => {
    const words = content.trim().split(/\s+/);
    setWordCount(words.length);
    setCharCount(content.length);
    setReadingTime(Math.ceil(words.length / 200));

    const uniqueWords = new Set(words).size;
    const score = Math.min(
      100,
      Math.floor((uniqueWords / words.length) * 100) +
        Math.min(50, words.length / 10)
    );
    setContentScore(score);
  };

  const handleTabChange = (tab) => {
    // No need to manually sync content here as it's already in state
    setActiveTab(tab);
  };

  return (
    <div className="dark:text-white">
      <div className="mb-4">
        <button
          className={`text-gray-900 bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800 shadow-lg shadow-lime-500/50 dark:shadow-lg dark:shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${
            activeTab === "editor"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleTabChange("editor")}
        >
          Editor
        </button>
        <button
          className={`text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 ${
            activeTab === "preview"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleTabChange("preview")}
        >
          Preview
        </button>
      </div>

      {activeTab === "editor" ? (
        <Editor
          apiKey="2zhf2cw2rpzcffhcfj8ui8hq6nm22cjny9miyay444w5vh2g"
          onInit={(_evt, editor) => (editorRef.current = editor)}
          initialValue={
            data?.content || "<p>This is the initial content of the editor.</p>"
          }
          value={previewContent} // Use the content state here
          init={{
            height: 500,
            menubar: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
              "codesample",
              "emoticons",
              "table",
            ],
            toolbar:
              "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | " +
              "bullist numlist outdent indent | removeformat | codesample | table | link image media | " +
              "emoticons | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            paste_data_images: true,
            paste_as_text: false,
            automatic_uploads: true,
            paste_enable_default_filters: false,
            paste_postprocess: (pluginApi, args) => {
              args.node.innerHTML = formatContent(args.node.innerHTML);
            },
            setup: (editor) => {
              editor.ui.registry.addButton("customAutoDetect", {
                text: "Auto-detect",
                onAction: () => {
                  const content = editor.getContent();
                  editor.setContent(formatContent(content));
                },
              });
            },
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
