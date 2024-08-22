import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { api } from "../api";
export const useEditPost = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const EditPost = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/content/edit/${id}`, {
        method: "PUT",
        body: data,
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Post Updated");
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

  return { loading, EditPost };
};
