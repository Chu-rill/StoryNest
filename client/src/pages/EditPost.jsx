import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../component/Header";
import Editor from "../component/Editor";
import { useEditPost } from "../hooks/useEditPost";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const { loading, EditPost } = useEditPost();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `https://nspire.vercel.app/content/post/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const post = await response.json();
        setTitle(post.post.title);
        setContent(post.post.content);
        setSummary(post.post.summary);
        // setPostInfo(post);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchPosts();
  }, []);

  const updatePost = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    data.set("file", files?.[0]);
    data.set("id", id);
    const success = await EditPost(data);
    if (success) {
      navigate("/home");
    }
  };

  return (
    <main>
      <Header />
      <form onSubmit={updatePost}>
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
        <input type="file" onChange={(e) => setFiles(e.target.files)} />
        <Editor value={content} onChange={setContent} />
        <button disabled={loading}>
          {loading ? <div className="loader"></div> : "Update Post"}
        </button>
      </form>
    </main>
  );
}
