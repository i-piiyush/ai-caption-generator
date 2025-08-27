import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

const postContext = createContext();

export const usePost = () => useContext(postContext);

const PostProvider = ({ children }) => {
  const [post, setPost] = useState(null);
  const [isGenerating, setIsGenerating] = useState(null);
  const api = "http://localhost:3000";

  const createPost = async (file) => {
    if (!file) {
      console.error("No file provided to createPost");
      return;
    }

    // 1. Set loading state to TRUE immediately.
    setIsGenerating(true);
    toast.loading("Uploading image and generating caption...");

    const formData = new FormData();
    formData.append("post", file); // Ensure this field name matches your Multer config

    try {
      const res = await axios.post(`${api}/posts/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast.dismiss();
      toast.success("Post created successfully!");

      setPost(res.data.post);

      return res.data.post;
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to create post. Please try again.");
      console.error(
        "Error creating post:",
        error.response?.data || error.message
      );
    } finally {
      // 3. Set loading state to FALSE after everything is done.
      setIsGenerating(false);
    }
  };

const regenerateCaption = async () => {
  toast.loading("wait a bit, your new caption is being cooked 🧑‍🍳")
  try {
    
    const res = await axios.put(
      `${api}/posts/${post._id}/generate-caption`,
      null, 
      {
        withCredentials: true,
      }
    );

    setPost(res.data.post);
    
    toast.dismiss()
    toast.success("Caption regenerated!");

  } catch (error) {
    
    if (error.response && error.response.status === 401) {
      toast.dismiss()
      toast.error("You are not authorized. Please log in again.");
    } else {
      toast.dismiss()
      toast.error("An error occurred while regenerating the caption.");
    }
  }
};

  return (
    <postContext.Provider
      value={{ createPost, post, isGenerating, regenerateCaption }}
    >
      {children}
    </postContext.Provider>
  );
};

export default PostProvider;
