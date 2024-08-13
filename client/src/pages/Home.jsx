import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import Post from "../component/Post";
export default function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:3001/content/getPost");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchPosts();
  }, []);
  return (
    <div>
      <Header />
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
