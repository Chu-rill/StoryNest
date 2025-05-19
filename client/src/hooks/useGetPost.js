// import React from "react";
import { useState } from "react";
import { api } from "../api";
export const useGetPost = () => {
  const [loading, setLoading] = useState(false);

  const getPost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${api}/content/getPost`);
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
