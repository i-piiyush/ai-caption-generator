import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { usePosts } from "../context/PostProvider"; // Import the posts context
import { useEffect, useState, useCallback } from "react";
import apiClient from "../services/api"; // Import our API client
import Loader from "../components/Loader"; // Your loading component

const ViewPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isGenerating, regenerateCaption } = usePosts(); // Get post functions
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // This function fetches a single post from the backend
  const fetchPost = useCallback(async () => {
    try {
      // First, try to find the post in the currently logged-in user's data
      const localPost = user?.posts?.find((p) => p._id === id);
      if (localPost) {
        setPost(localPost);
      } else {
        // If not found locally, fetch it directly from the API
        const response = await apiClient.get(`/posts/${id}`);
        setPost(response.data.post);
      }
    } catch (error) {
      console.error("Failed to fetch post", error);
      // Optionally, navigate to a 404 page
    } finally {
      setLoading(false);
    }
  }, [id, user?.posts]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleRegenerate = async () => {
    const updatedPost = await regenerateCaption(id);
    if (updatedPost) {
      setPost(updatedPost); // Update local state with the new caption
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!post) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-2xl">Post not found.</h1>
      </div>
    );
  }

  return (
    <>
      <div className="md:hidden min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center py-12 px-6">
        <div className="max-w-lg w-full flex flex-col gap-8">
          <div className="w-full aspect-[4/5] bg-gray-300 overflow-hidden">
            <img src={post.post} alt="User post" className="h-full w-full object-cover" />
          </div>

          <div className="flex justify-between items-center">
             <span className="uppercase text-gray-600 tracking-wide font-medium text-xs">
               AI Generated Caption
             </span>
             <button 
                onClick={handleRegenerate} 
                disabled={isGenerating}
                className="text-xs font-semibold bg-gray-200 px-3 py-1 rounded-md disabled:opacity-50"
              >
               {isGenerating ? "Generating..." : "Regenerate"}
             </button>
          </div>
          
          <p className="text-base font-light leading-relaxed tracking-wide">
            {post.caption}
          </p>
        </div>
      </div>
      <div className="hidden md:flex min-h-screen items-center justify-center text-center">
        <h1 className="text-xl">This app is designed for mobile use.</h1>
      </div>
    </>
  );
};

export default ViewPost;
