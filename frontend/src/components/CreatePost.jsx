import React, { useState } from "react";
import { usePosts } from "../context/PostProvider";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const { createPost, regenerateCaption, isGenerating } = usePosts();
  const { checkSession } = useAuth();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [createdPostId, setCreatedPostId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setCreatedPostId(null);
      setCaption("");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setCreatedPostId(null);
      setCaption("");
    } else {
      toast.error("Please upload an image file");
    }
  };

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
          
          {/* Upload area with improved drag and drop */}
          <div 
            className={`relative mb-6 border-2 border-dashed rounded-lg transition-all duration-200 ${isDragging ? 'border-gray-700 bg-gray-100' : createdPostId ? 'border-green-600 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label htmlFor="file-upload" className="block cursor-pointer p-8">
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-contain rounded-md mx-auto" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 flex items-center justify-center transition-all rounded-md">
                    <span className="text-white opacity-0 hover:opacity-100 text-sm font-medium bg-black bg-opacity-50 px-3 py-1 rounded">
                      Change Image
                    </span>
                  </div>
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
              onChange={handleImageChange} 
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={handleGenerate}
              disabled={!imageFile || !!createdPostId || isGenerating}
              className="flex-grow px-4 py-3 bg-gray-900 text-white rounded-lg font-medium disabled:bg-gray-400 transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : "Generate Caption"}
            </button>
            <button
              onClick={handleRegenerate}
              disabled={!createdPostId || isGenerating}
              className="px-4 py-3 bg-gray-700 text-white rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Caption display */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Generated Caption</span>
              {caption && (
                <button 
                  onClick={() => {navigator.clipboard.writeText(caption); toast.success("Copied to clipboard!")}}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              )}
            </div>
            <div className={`p-4 border rounded-lg min-h-[6rem] transition-colors ${caption ? 'bg-gray-50 border-gray-300' : 'bg-gray-100 border-gray-200'}`}>
              <p className="text-gray-700 whitespace-pre-line">
                {caption || "Your AI-generated caption will appear here..."}
              </p>
            </div>
          </div>

          {/* Finalize button */}
          <button 
            onClick={handleFinalizePost}
            disabled={!createdPostId}
            className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
          >
            Add to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;