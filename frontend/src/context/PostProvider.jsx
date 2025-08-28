import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import apiClient from "../services/api"; // Import the centralized API client

const PostContext = createContext(null);

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};

export const PostProvider = ({ children }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // This function is now responsible only for the API call and loading states.
  // It returns the new post data on success, so the calling component can update its own state.
  const createPost = useCallback(async (file) => {
    if (!file) {
      toast.error("Please select an image to create a post.");
      return null;
    }

    setIsGenerating(true);
    toast.loading("Uploading image and generating caption...");

    const formData = new FormData();
    formData.append("post", file);

    try {
      const response = await apiClient.post("/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.dismiss();
      toast.success("Post created successfully!");
      return response.data.post; // Return the new post
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to create post.");
      console.error("Error creating post:", error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []); // Empty dependency array as it doesn't depend on external state

  const regenerateCaption = useCallback(async (postId) => {
    if (!postId) {
      toast.error("Post ID is missing.");
      return null;
    }

    toast.loading("Cooking up a new caption... 🧑‍🍳");
    setIsGenerating(true);

    try {
      const response = await apiClient.put(`/posts/${postId}/generate-caption`);
      
      toast.dismiss();
      toast.success("Caption regenerated!");
      return response.data.post; // Return the updated post
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to regenerate caption.");
      console.error("Error regenerating caption:", error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // useMemo ensures that the context value object is only recreated when its dependencies change.
  // This prevents unnecessary re-renders in components that consume the context.
  const value = useMemo(
    () => ({
      isGenerating,
      createPost,
      regenerateCaption,
    }),
    [isGenerating, createPost, regenerateCaption]
  );

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
