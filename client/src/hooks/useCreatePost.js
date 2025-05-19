import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../api";
export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);

  const createPost = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/content/post`, {
        method: "POST",
        body: data,
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Post Created");
        return true; // Indicate success
      } else {
        toast.error("Failed to create post");
        return false; // Indicate failure
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("An error occurred");
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  };

  return { loading, createPost };
};
