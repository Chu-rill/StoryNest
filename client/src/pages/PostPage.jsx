import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../component/Header";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../context/UserContext";
import { useShowPost } from "../hooks/useShowPost";

export default function PostPage() {
  const { id } = useParams();
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const { loading, showPost } = useShowPost();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await showPost();
        setPostInfo(data);
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
