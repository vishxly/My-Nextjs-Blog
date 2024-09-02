import { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { usePostForm } from "../contexts/PostFormContext";
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css"; // Import the highlight.js theme

export function RTEField() {
  const { data, handleData } = usePostForm();
  const editorRef = useRef(null);
  const [previewContent, setPreviewContent] = useState("");

  const handleChange = (content) => {
    handleData("content", content);
    setPreviewContent(content); // Update the preview content as the editor content changes
  };

  useEffect(() => {
    // Configure Highlight.js to support a range of languages
    hljs.configure({
      languages: ["javascript", "python", "ruby", "go", "java", "html", "css"],
    });

    if (editorRef.current) {
      // Automatically format content when pasted
      editorRef.current.on("PastePostProcess", (event) => {
        event.content = formatContent(event.content);
      });
    }
  }, []);

  const formatContent = (content) => {
    // Use Highlight.js to automatically highlight code blocks
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;

    tempDiv.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightBlock(block);
    });

    return tempDiv.innerHTML;
  };

  return (
    <div className="dark:text-white">
      <Editor
        apiKey="2zhf2cw2rpzcffhcfj8ui8hq6nm22cjny9miyay444w5vh2g"
        onInit={(_evt, editor) => (editorRef.current = editor)}
        initialValue={
          data?.content || "<p>This is the initial content of the editor.</p>"
        }
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
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "codesample | removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          paste_data_images: true, // Allows image pasting directly
          paste_as_text: false, // Keeps formatting from pasted content
          automatic_uploads: true,
          paste_enable_default_filters: false,
          paste_postprocess: (pluginApi, args) => {
            args.node.innerHTML = formatContent(args.node.innerHTML);
          },
        }}
        onEditorChange={handleChange}
      />
      {/* <button onClick={log}>Log editor content</button> */}

      {/* Preview Section */}
      <div className="p-4 mt-4 bg-gray-100 border rounded dark:bg-black">
        <h3 className="mb-2 text-lg font-semibold">Live Preview</h3>
        <div
          className="preview-content"
          dangerouslySetInnerHTML={{ __html: previewContent }}
        />
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
