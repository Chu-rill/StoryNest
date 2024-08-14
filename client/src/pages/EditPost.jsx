import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../component/Header";
import Editor from "../component/Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/content/post/${id}`
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
    const response = await fetch(`http://localhost:3001/content/edit/${id}`, {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
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
        <button style={{ marginTop: "5px" }}>Update Post</button>
      </form>
    </main>
  );
}
