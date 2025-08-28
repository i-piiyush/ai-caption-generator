import React from "react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- FIX 1: Add a loading state ---
  // If the user object or its nested 'user' property doesn't exist yet, show a loading screen.
  // This prevents all "cannot read properties of undefined" errors.
  if (!user || !user.user) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h1 className="text-2xl">Loading profile...</h1>
      </div>
    );
  }

  // --- FIX 2: Correctly access the 'posts' array ---
  // The backend returns a 'posts' key (plural), not 'post' (singular).
  // Also, provide a default empty array to be safe.
  const posts = user.posts || [];

  const goToPost = (id) => {
    navigate(`/post/${id}`);
  };

  const createPost = () => {
    navigate("/create-post");
  };

  const handleLogout = () => {
    logout();
    navigate("/login")
  };

  return (
    <>
      <div className="w-full h-screen md:hidden tracking-tighter relative">
        <div className="bg-white px-8 py-4">
          <h1 className="text-2xl font-bold">@{user.user.username}</h1>
        </div>
        <div className="px-8 py-4 bg-white flex flex-col gap-3 justify-center items-center">
          <span className="bg-zinc-400 h-40 w-40 rounded-full overflow-hidden">
            <img
              src={user.user.pfp}
              alt="pfp"
              className="h-full w-full object-cover"
            />
          </span>
          <h1 className="text-3xl font-bold ">{user.user.fullname}</h1>
          <p className="w-[70%] text-center text-sm leading-[1] opacity-70">
            {user.user.bio}
          </p>
          <a
            href="https://github.com/piiyushhh" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-16 py-2 text-sm font-semibold rounded-md mt-5"
          >
            Star my GitHub
          </a>
        </div>

        <div className="w-full px-8 py-4 flex justify-center gap-4 flex-wrap">
          {/* This .map call is now safe */}
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id} // Use a unique key like post ID instead of index
                className="h-64 w-56 bg-zinc-500 overflow-hidden cursor-pointer"
                onClick={() => goToPost(post._id)}
              >
                <img
                  src={post.post} // Assuming the image URL is in 'post.post'
                  alt="post"
                  className="h-full w-full object-cover"
                />
              </div>
            ))
          ) : (
            <p className="opacity-70">No posts yet.</p>
          )}
        </div>

        <span
          className="rounded bg-black fixed bottom-5 left-1/2 -translate-x-1/2 text-white flex justify-between items-center cursor-pointer px-10 gap-4 py-3"
          onClick={createPost}
        >
          <GoPlus size={"1.6rem"} /> create post
        </span>
        <span
          className="rounded bg-black fixed top-5 right-5 text-white flex justify-between items-center cursor-pointer px-10 gap-4 py-3"
          onClick={handleLogout}
        >
          logout
        </span>
      </div>

      <div className="hidden md:flex justify-center items-center text-3xl w-full h-screen">
        <h1>This website is only available for mobile</h1>
      </div>
    </>
  );
};

export default Profile;
