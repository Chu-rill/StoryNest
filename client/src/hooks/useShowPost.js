import { useState } from "react";
import { useParams } from "react-router-dom";
// import { toast } from "react-hot-toast";

export const useShowPost = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams(); // Get id from route parameters

  const showPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/content/post/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const post = await response.json();
      return post;
    } catch (error) {
      console.error("Fetch error:", error);
      //   toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { loading, showPost };
};
