import React, { useEffect, useState } from "react";
import { usePost } from "../context/PostProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const { createPost, post, isGenerating, regenerateCaption } = usePost();
  const navigate = useNavigate()

  useEffect(() => {
    if (post?.caption) {
      setCaption(post.caption);
    }
  }, [post]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!image) {
      toast.error("Please upload an image first.");
      return;
    }
    const newPost = await createPost(image);
    setHasGenerated(true);
    if (newPost?.caption) {
      setCaption(newPost.caption);
    }
  };

  const handleRegenerate = async () => {
    await regenerateCaption();
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-6">
      <div className="w-full max-w-md bg-white p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Create Post
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Upload an image and let AI generate a caption
        </p>

        <div className="mb-6">
          <label className="block mb-3 font-semibold text-gray-900">
            Upload an Image
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              className={`flex flex-col items-center justify-center w-full h-40 border-2 rounded-lg transition-all duration-200 ${
                hasGenerated
                  ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                  : `hover:bg-gray-50 cursor-pointer ${
                      image
                        ? "border-transparent"
                        : "border-dashed border-gray-400"
                    }`
              }`}
            >
              <div className="flex flex-col items-center justify-center w-full h-full text-center">
                {hasGenerated ? (
                  <img
                    src={imagePreview}
                    alt="Locked preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <svg
                      className="w-8 h-8 mb-4 text-gray-600"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                  </>
                )}
              </div>
              <input
                id="dropzone-file"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={hasGenerated}
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            className="w-[60%] px-4 py-3 h-12 bg-gray-900 text-white rounded-lg font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors duration-200"
            onClick={() => handleGenerate(image)}
            disabled={hasGenerated || isGenerating}
          >
            {isGenerating
              ? "Generating..."
              : hasGenerated
              ? "Generated"
              : "Generate Caption"}
          </button>
          <button
            onClick={handleRegenerate}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-[70%] px-4 py-3 h-12 bg-gray-900 text-white rounded-md flex items-center justify-center font-medium gap-2 shadow-md hover:shadow-lg text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!hasGenerated || isGenerating}
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                isHovered ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            Regenerate
          </button>
        </div>

        <div className="p-5 mt-6  rounded-lg border border-gray-400">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            Generated Caption
          </h2>
          <div className="p-3 bg-white rounded-md text-gray-900 text-md  min-h-[5rem] w-full flex items-center justify-center ">
            <p className="w-full italic opacity-80 text-sm">
              {isGenerating
                ? "Please wait while the caption generates..."
                : caption || "Your caption will appear here."}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium cursor-pointer hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed  transition-colors duration-200 shadow-md" 
          disabled={!hasGenerated}
          onClick={()=>{
            navigate("/")
          }}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
