import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { usePostForm } from "../contexts/PostFormContext";
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";
import { Tab } from '@headlessui/react';

export function RTEField() {
  const { data, handleData } = usePostForm();
  const editorRef = useRef(null);
  const [previewContent, setPreviewContent] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (content) => {
    handleData("content", content);
    setPreviewContent(content);
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

    return tempDiv.innerHTML;
  };

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const wordCount = previewContent.trim().split(/\s+/).length;

  return (
    <div className="dark:text-white">
      <Tab.Group selectedIndex={activeTab} onChange={handleTabChange}>
        <Tab.List className="flex p-1 space-x-1 rounded-xl bg-blue-900/20">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
             ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
          }>
            Editor
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
             ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'}`
          }>
            Preview
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <Editor
              apiKey="2zhf2cw2rpzcffhcfj8ui8hq6nm22cjny9miyay444w5vh2g"
              onInit={(_evt, editor) => (editorRef.current = editor)}
              initialValue={data?.content || "<p>Add Content</p>"}
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
                  "codesample | removeformat | help",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                paste_data_images: true,
                paste_as_text: false,
                automatic_uploads: true,
                paste_enable_default_filters: false,
                paste_postprocess: (pluginApi, args) => {
                  args.node.innerHTML = formatContent(args.node.innerHTML);
                },
              }}
              onEditorChange={handleChange}
            />
          </Tab.Panel>
          <Tab.Panel>
            <div className="p-4 bg-gray-100 border rounded dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold">Preview</h3>
              <div
                className="prose preview-content dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Word count: {wordCount}
      </div>
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
