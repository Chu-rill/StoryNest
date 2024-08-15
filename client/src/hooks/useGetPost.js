// import React from "react";
import { useState } from "react";
export const useGetPost = () => {
  const [loading, setLoading] = useState(false);

  const getPost = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/content/getPost");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return { loading, getPost };
};
