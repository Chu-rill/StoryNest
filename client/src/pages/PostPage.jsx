import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../component/Header";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../context/UserContext";

export default function PostPage() {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);

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
    <main>
      <Header />
      <div className="post-page">
        <h1>{postInfo.post.title}</h1>
        <time>{formatISO9075(new Date(postInfo.post.createdAt))}</time>
        <div className="author">by @{postInfo.post.author.username}</div>
        {userInfo.id === postInfo.post.author._id && (
          <div className="edit">
            <Link className="edit-btn" to={`/edit/${id}`}>
              Edit Profile
            </Link>
          </div>
        )}
        <div className="image">
          <img src={`http://localhost:3001/${postInfo.post.image}`} alt="" />
        </div>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: postInfo.post.content }}
        />
      </div>
    </main>
  );
}
