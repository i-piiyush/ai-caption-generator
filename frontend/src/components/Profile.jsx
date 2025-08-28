import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { usePosts } from "../context/PostProvider";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import Loader from "../components/Loader";

const Profile = () => {
  const { user, logout } = useAuth();
  const { createPost, isGenerating } = usePosts(); // Get functions from PostProvider
  const navigate = useNavigate();

  // The Profile component now manages its own list of posts.
  // It's initialized with the posts from the user object.
  const [posts, setPosts] = useState(user?.posts || []);

  // This is a placeholder for a proper file input handler
  const handleCreatePostClick = () => {
    // In a real app, you would open a file dialog here
    // For now, we'll navigate to the create post page
    navigate("/create-post");
  };

  if (!user || !user.user) {
    // This check is now mostly a fallback, as the router handles loading.
    return <Loader />;
  }


  return (
    <>
      <div className="w-full min-h-screen md:hidden tracking-tighter relative pb-24">
        <div className="bg-white px-8 py-4">
          <h1 className="text-2xl font-bold">@{user.user.username}</h1>
        </div>
        <div className="px-8 py-4 bg-white flex flex-col gap-3 justify-center items-center">
          <span className="bg-zinc-400 h-40 w-40 rounded-full overflow-hidden">
            <img src={user.user.pfp} alt="Profile" className="h-full w-full object-cover"/>
          </span>
          <h1 className="text-3xl font-bold ">{user.user.fullname}</h1>
          <p className="w-[70%] text-center text-sm leading-[1] opacity-70">
            {user.user.bio}
          </p>
          <a href="https://github.com/i-piiyush/ai-caption-generator" target="_blank" rel="noopener noreferrer" className="bg-black text-white px-16 py-2 text-sm font-semibold rounded-md mt-5">
            Star my GitHub
          </a>
        </div>

        <div className="w-full px-8 py-4 flex justify-center gap-4 flex-wrap">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className="h-64 w-56 bg-zinc-500 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/post/${post._id}`)}
              >
                <img src={post.post} alt="User post" className="h-full w-full object-cover"/>
              </div>
            ))
          ) : (
            <p className="opacity-70 mt-4">No posts yet. Click the button below to create one!</p>
          )}
        </div>

        <span className="rounded bg-black fixed bottom-5 left-1/2 -translate-x-1/2 text-white flex items-center cursor-pointer px-10 gap-4 py-3" onClick={handleCreatePostClick}>
          <GoPlus size={"1.6rem"} /> Create Post
        </span>
        <span className="rounded bg-black fixed top-5 right-5 text-white flex items-center cursor-pointer px-10 gap-4 py-3" onClick={logout}>
          Logout
        </span>
      </div>

      <div className="hidden md:flex justify-center items-center text-3xl w-full h-screen">
        <h1>This website is only available for mobile</h1>
      </div>
    </>
  );
};

export default Profile;
