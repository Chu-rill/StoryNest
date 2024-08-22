import React, { useState } from "react";
import Header from "../component/Header";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import Editor from "../component/Editor";
import { useCreatePost } from "../hooks/useCreatePost";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState(null);
  const navigate = useNavigate();
  const { loading, createPost } = useCreatePost();

  const createNewPost = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files[0]);

    const success = await createPost(data);
    if (success) {
      navigate("/home");
    }
  };

  return (
    <main>
      <Header />
      <form onSubmit={createNewPost}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <input
          type="file"
          name="picture"
          onChange={(e) => setFiles(e.target.files)}
        />
        <Editor value={content} onChange={setContent} />
        <button disabled={loading}>
          {loading ? <div className="loader"></div> : "Create Post"}
        </button>
      </form>
    </main>
  );
}
