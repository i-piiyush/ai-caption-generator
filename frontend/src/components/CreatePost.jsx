import React, { useState } from "react";
import { usePosts } from "../context/PostProvider";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const { createPost, regenerateCaption, isGenerating } = usePosts();
  const { checkSession } = useAuth();

  // State is now simpler: just the file itself, no preview URL.
  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [createdPostId, setCreatedPostId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Simplified handler: just sets the file and resets state.
  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setCreatedPostId(null);
      setCaption("");
    } else if (file) {
      toast.error("Please upload a valid image file.");
    }
  };

  const handleFileSelect = (e) => {
    handleImageChange(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageChange(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };

  const handleGenerate = async () => {
    if (!imageFile) {
      toast.error("Please upload an image first.");
      return;
    }
    const newPost = await createPost(imageFile);
    if (newPost) {
      setCreatedPostId(newPost._id);
      setCaption(newPost.caption);
    }
  };

  const handleRegenerate = async () => {
    if (!createdPostId) {
      toast.error("You must generate a caption before regenerating.");
      return;
    }
    const updatedPost = await regenerateCaption(createdPostId);
    if (updatedPost) {
      setCaption(updatedPost.caption);
    }
  };

  const handleFinalizePost = async () => {
    if (!createdPostId) {
      toast.error("Please generate a caption before posting.");
      return;
    }
    await checkSession();
    toast.success("Post successfully added to your profile!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Create New Post</h1>
          <p className="text-gray-600 text-center text-sm mb-6">Upload an image to generate an AI-powered caption</p>
          
          <div 
            className={`relative mb-6 border-2 border-dashed rounded-lg transition-all duration-200 ${isDragging ? 'border-gray-700 bg-gray-100' : 'border-gray-300 hover:border-gray-400'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label htmlFor="file-upload" className="block cursor-pointer p-8">
              {/* This section is now simplified. It shows either the upload prompt or the selected file's name. */}
              {imageFile ? (
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                  <p className="text-gray-700 font-medium">Image Selected</p>
                  <p className="text-gray-500 text-sm truncate w-full">{imageFile.name}</p>
                  <p className="text-xs text-gray-400 mt-2">Click here to change image</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="text-center">
                    <p className="text-gray-700 font-medium">Drag & drop your image here</p>
                    <p className="text-gray-500 text-sm">or click to browse</p>
                  </div>
                </div>
              )}
            </label>
            <input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileSelect} 
            />
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleGenerate}
              disabled={!imageFile || !!createdPostId || isGenerating}
              className="flex-grow px-4 py-3 bg-gray-900 text-white rounded-lg font-medium disabled:bg-gray-400 transition-colors"
            >
              {isGenerating ? "Generating..." : "Generate Caption"}
            </button>
            <button
              onClick={handleRegenerate}
              disabled={!createdPostId || isGenerating}
              className="px-4 py-3 bg-gray-700 text-white rounded-lg font-medium disabled:bg-gray-400 transition-colors"
            >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 block mb-2">Generated Caption</label>
            <div className="p-4 border rounded-lg min-h-[6rem] bg-gray-50 border-gray-300">
              <p className="text-gray-700 whitespace-pre-line">
                {caption || "Your AI-generated caption will appear here..."}
              </p>
            </div>
          </div>

          <button 
            onClick={handleFinalizePost}
            disabled={!createdPostId}
            className="w-full px-4 py-3 bg-black text-white rounded-lg font-semibold disabled:bg-gray-400 transition-colors"
          >
            Add to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
