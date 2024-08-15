import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import Post from "../component/Post";
import { useGetPost } from "../hooks/useGetPost";
export default function Home() {
  const [posts, setPosts] = useState([]);
  const { loading, getPost } = useGetPost();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPost();
        setPosts(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchPosts();
  }, [getPost]);
  return (
    <div>
      <Header />
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}
