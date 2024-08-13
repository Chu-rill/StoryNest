import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../component/Header";

export default function PostPage() {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState(null);
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
        console.log(post);
        setPostInfo(post);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchPosts();
  }, []);

  if (!postInfo) return "";
  return (
    <>
      <Header />
      <div className="post-page">
        <div className="image">
          <img src={`http://localhost:3001/${postInfo.post.image}`} alt="" />
        </div>
        <h1>{postInfo.post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: postInfo.post.content }} />
      </div>
    </>
  );
}
